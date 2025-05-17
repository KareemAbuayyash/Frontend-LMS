// src/main/java/com/example/lms/controller/SubmissionController.java
package com.example.lms.controller;

import com.example.lms.dto.SubmissionResponse;
import com.example.lms.dto.QuizSubmissionRequest;
import com.example.lms.dto.ScoreRequest;
import com.example.lms.entity.Submission;
import com.example.lms.entity.Student;
import com.example.lms.entity.User;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.mapper.SubmissionMapper;
import com.example.lms.repository.StudentRepository;
import com.example.lms.repository.UserRepository;
import com.example.lms.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private static final Logger logger = LoggerFactory.getLogger(SubmissionController.class);

    private final QuizService quizService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    // helper to map + look up name
    private SubmissionResponse toDtoWithName(Submission sub) {
        SubmissionResponse dto = SubmissionMapper.toResponse(sub);
        String name = studentRepository.findById(sub.getStudentId())
                        .map(Student::getUser)
                        .map(User::getUsername)
                        .orElse("‹unknown›");
        dto.setStudentName(name);
        return dto;
    }

    // ------------------------------------------------
    // Fetch any submission by its ID (admins & instructors)
    // ------------------------------------------------
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @GetMapping("/{submissionId}")
    public ResponseEntity<SubmissionResponse> getSubmissionById(
            @PathVariable Long submissionId) {

        logger.info("Fetching submission with ID: {}", submissionId);
        Submission submission = quizService.getSubmissionById(submissionId);
        return ResponseEntity.ok(toDtoWithName(submission));
    }

    // ------------------------------------------------
    // Update a submission (anyone who can view it)
    // ------------------------------------------------
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR','STUDENT')")
    @PutMapping("/{submissionId}")
    public ResponseEntity<SubmissionResponse> updateSubmission(
            @PathVariable Long submissionId,
            @RequestBody QuizSubmissionRequest request
    ) {
        logger.info("Updating submission with ID: {}", submissionId);
        Submission updated = quizService.updateSubmission(submissionId, request.getAnswers());
        return ResponseEntity.ok(toDtoWithName(updated));
    }

    // ------------------------------------------------
    // Instructor fetches submissions for a given quiz & student
    // ------------------------------------------------
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @GetMapping("/quizzes/{quizId}/students/{studentId}")
    public ResponseEntity<List<SubmissionResponse>> getStudentSubmissions(
            @PathVariable Long quizId,
            @PathVariable Long studentId
    ) {
        logger.info("Fetching submissions for quiz {} and student {}", quizId, studentId);
        List<Submission> subs = quizService.getSubmissionsByQuizAndStudent(quizId, studentId);
        List<SubmissionResponse> resp = subs.stream()
            .map(this::toDtoWithName)
            .collect(Collectors.toList());
        return ResponseEntity.ok(resp);
    }

    // ------------------------------------------------
    // Instructor submits on behalf of a student
    // ------------------------------------------------
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PostMapping("/quizzes/{quizId}/students/{studentId}")
    public ResponseEntity<SubmissionResponse> submitQuizForStudent(
            @PathVariable Long quizId,
            @PathVariable Long studentId,
            @RequestBody QuizSubmissionRequest request
    ) {
        logger.info("Instructor submitting quiz {} for student {}", quizId, studentId);
        Submission saved = quizService.submitQuiz(quizId, studentId, request.getAnswers());
        return ResponseEntity.ok(toDtoWithName(saved));
    }

    // ------------------------------------------------
    // “Me” endpoints for students
    // ------------------------------------------------
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/quizzes/{quizId}/students/me")
    public ResponseEntity<SubmissionResponse> getMySubmission(
            @PathVariable Long quizId,
            Authentication auth
    ) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Student student = studentRepository.findByUser(user);
        if (student == null) {
            throw new ResourceNotFoundException("Student record not found for user: " + username);
        }

        List<Submission> subs = quizService.getSubmissionsByQuizAndStudent(quizId, student.getId());
        if (subs.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toDtoWithName(subs.get(0)));
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/quizzes/{quizId}/students/me")
    public ResponseEntity<SubmissionResponse> submitQuizAsMe(
            @PathVariable Long quizId,
            Authentication auth,
            @RequestBody QuizSubmissionRequest request
    ) {
        logger.info("Student {} submitting quiz {}", auth.getName(), quizId);
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + auth.getName()));
        Student student = studentRepository.findByUser(user);
        if (student == null) {
            throw new ResourceNotFoundException("Student record not found for user: " + auth.getName());
        }

        Submission saved = quizService.submitQuiz(quizId, student.getId(), request.getAnswers());
        return ResponseEntity.ok(toDtoWithName(saved));
    }

    // ------------------------------------------------
    // Instructor grading
    // ------------------------------------------------
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PutMapping("/quizzes/{quizId}/submissions/{submissionId}/grade")
    public ResponseEntity<SubmissionResponse> gradeQuizSubmission(
            @PathVariable Long quizId,
            @PathVariable Long submissionId,
            @RequestBody ScoreRequest scoreRequest
    ) {
        logger.info("Grading submission {} of quiz {} → score {}",
                submissionId, quizId, scoreRequest.getScore());
        Submission graded = quizService.gradeQuizSubmission(submissionId, scoreRequest.getScore());
        return ResponseEntity.ok(toDtoWithName(graded));
    }

    // ------------------------------------------------
    // Fetch all submissions by course
    // ------------------------------------------------
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @GetMapping("/quizzes/course/{courseId}")
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsByCourse(
            @PathVariable Long courseId
    ) {
        logger.info("Fetching all submissions for course {}", courseId);
        List<Submission> subs = quizService.getSubmissionsByCourse(courseId);
        List<SubmissionResponse> resp = subs.stream()
            .map(this::toDtoWithName)
            .collect(Collectors.toList());
        return ResponseEntity.ok(resp);
    }

    // ------------------------------------------------
    // Fetch all submissions for a quiz
    // ------------------------------------------------
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @GetMapping("/quizzes/{quizId}")
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsForQuiz(
            @PathVariable Long quizId
    ) {
        logger.info("Fetching all submissions for quiz {}", quizId);
        List<Submission> subs = quizService.getSubmissionsByQuiz(quizId);
        List<SubmissionResponse> resp = subs.stream()
            .map(this::toDtoWithName)
            .collect(Collectors.toList());
        return ResponseEntity.ok(resp);
    }

    // ------------------------------------------------
    // Fetch submissions for a quiz within a specific course
    // ------------------------------------------------
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @GetMapping("/courses/{courseId}/quizzes/{quizId}")
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsForQuizInCourse(
            @PathVariable Long courseId,
            @PathVariable Long quizId
    ) {
        logger.info("Fetching submissions for quiz {} in course {}", quizId, courseId);
        List<Submission> subs = quizService.getSubmissionsByQuizAndCourse(quizId, courseId);
        List<SubmissionResponse> resp = subs.stream()
            .map(this::toDtoWithName)
            .collect(Collectors.toList());
        return ResponseEntity.ok(resp);
    }
}
