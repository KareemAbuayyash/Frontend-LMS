package com.example.lms.controller;

import com.example.lms.dto.QuizSubmissionRequest;
import com.example.lms.dto.ScoreRequest;
import com.example.lms.dto.SubmissionResponse;
import com.example.lms.entity.Student;
import com.example.lms.entity.Submission;
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

    // @PreAuthorize("hasAnyRole('INSTRUCTOR', 'STUDENT')")
    // @PostMapping("/quizzes/{quizId}/students/{studentId}")
    // public ResponseEntity<Submission> submitQuiz(
    //         @PathVariable Long quizId,
    //         @PathVariable Long studentId,
    //         @RequestBody QuizSubmissionRequest request) {
    //     logger.info("Request received to submit quiz with ID: {} for student ID: {}", quizId, studentId);
    //     Submission submission = quizService.submitQuiz(quizId, studentId, request.getAnswers());
    //     logger.info("Quiz submitted successfully with submission ID: {}", submission.getId());
    //     return ResponseEntity.ok(submission);
    // }

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @GetMapping("/{submissionId}")
    public ResponseEntity<SubmissionResponse> getSubmissionById(@PathVariable Long submissionId) {
        logger.info("Request received to fetch submission with ID: {}", submissionId);
        Submission submission = quizService.getSubmissionById(submissionId);
        logger.info("Submission with ID: {} fetched successfully", submissionId);
        return ResponseEntity.ok(SubmissionMapper.toResponse(submission));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'STUDENT')")
    @PutMapping("/{submissionId}")
    public ResponseEntity<Submission> updateSubmission(
            @PathVariable Long submissionId,
            @RequestBody QuizSubmissionRequest request) {
        logger.info("Request received to update submission with ID: {}", submissionId);
        Submission updatedSubmission = quizService.updateSubmission(submissionId, request.getAnswers());
        logger.info("Submission with ID: {} updated successfully", submissionId);
        return ResponseEntity.ok(updatedSubmission);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @GetMapping("/quizzes/{quizId}/students/{studentId}")
    public ResponseEntity<List<SubmissionResponse>> getStudentSubmissions(
            @PathVariable Long quizId,
            @PathVariable Long studentId) {
        logger.info("Request received to fetch submissions for quiz ID: {} and student ID: {}", quizId, studentId);
        List<Submission> submissions = quizService.getSubmissionsByQuizAndStudent(quizId, studentId);
        logger.info("Fetched {} submissions for quiz ID: {} and student ID: {}", submissions.size(), quizId, studentId);
        List<SubmissionResponse> responses = submissions.stream()
                .map(SubmissionMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PreAuthorize("hasRole('INSTRUCTOR')")
    @PutMapping("/quizzes/{quizId}/submissions/{submissionId}/grade")
    public ResponseEntity<SubmissionResponse> gradeQuizSubmission(
            @PathVariable Long quizId,
            @PathVariable Long submissionId,
            @RequestBody ScoreRequest scoreRequest) {
        logger.info("Instructor grading quiz submission: quizId={}, submissionId={}, new score={}",
                quizId, submissionId, scoreRequest.getScore());
        Submission updatedSubmission = quizService.gradeQuizSubmission(submissionId, scoreRequest.getScore());
        SubmissionResponse response = SubmissionMapper.toResponse(updatedSubmission);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @GetMapping("/quizzes/course/{courseId}")
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsByCourse(@PathVariable Long courseId) {
        logger.info("Request received to fetch all quiz submissions for course ID: {}", courseId);
        List<Submission> submissions = quizService.getSubmissionsByCourse(courseId);
        List<SubmissionResponse> responses = submissions.stream()
                .map(SubmissionMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @GetMapping("/quizzes/{quizId}")
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsForQuiz(@PathVariable Long quizId) {
        logger.info("Request received to fetch all submissions for quiz ID: {}", quizId);
        List<Submission> submissions = quizService.getSubmissionsByQuiz(quizId);
        List<SubmissionResponse> responses = submissions.stream()
                .map(SubmissionMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @GetMapping("/courses/{courseId}/quizzes/{quizId}")
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsForQuizInCourse(
            @PathVariable Long courseId,
            @PathVariable Long quizId) {
        logger.info("Request received to fetch submissions for quiz ID: {} in course ID: {}", quizId, courseId);
        List<Submission> submissions = quizService.getSubmissionsByQuizAndCourse(quizId, courseId);
        List<SubmissionResponse> responses = submissions.stream()
                .map(SubmissionMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
   // new “me” shortcut:
@PostMapping("/quizzes/{quizId}/students/{studentId}")
@PreAuthorize("hasAnyRole('INSTRUCTOR','STUDENT')")
public ResponseEntity<SubmissionResponse> submitQuiz(
    @PathVariable Long quizId,
    @PathVariable Long studentId,
    @RequestBody QuizSubmissionRequest request
) {
  Submission saved = quizService.submitQuiz(quizId, studentId, request.getAnswers());
  return ResponseEntity.ok( SubmissionMapper.toResponse(saved) );
}

@PostMapping("/quizzes/{quizId}/students/me")
@PreAuthorize("hasRole('STUDENT')")
public ResponseEntity<SubmissionResponse> submitQuizAsMe(
    @PathVariable Long quizId,
    Authentication auth,
    @RequestBody QuizSubmissionRequest request
) {
  // 1) get the username
  String username = auth.getName();

  // 2) load the User (throws 404 if not found)
  User user = userRepository.findByUsername(username)
      .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

  // 3) load the Student record (throws 404 if missing)
  Student student = studentRepository.findByUser(user);
  if (student == null) {
    throw new ResourceNotFoundException("Student record not found for user: " + username);
  }

  // 4) do the submission
  Submission saved = quizService.submitQuiz(quizId, student.getId(), request.getAnswers());

  // 5) return a clean DTO
  return ResponseEntity.ok( SubmissionMapper.toResponse(saved) );
}

}
