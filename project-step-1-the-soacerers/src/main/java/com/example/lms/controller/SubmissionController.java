package com.example.lms.controller;

import com.example.lms.dto.QuizSubmissionRequest;
import com.example.lms.dto.ScoreRequest;
import com.example.lms.dto.SubmissionResponse;
import com.example.lms.entity.Submission;
import com.example.lms.mapper.SubmissionMapper;
import com.example.lms.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private static final Logger logger = LoggerFactory.getLogger(SubmissionController.class);
    private final QuizService quizService;

    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'STUDENT')")
    @PostMapping("/quizzes/{quizId}/students/{studentId}")
    public ResponseEntity<Submission> submitQuiz(
            @PathVariable Long quizId,
            @PathVariable Long studentId,
            @RequestBody QuizSubmissionRequest request) {
        logger.info("Request received to submit quiz with ID: {} for student ID: {}", quizId, studentId);
        Submission submission = quizService.submitQuiz(quizId, studentId, request.getAnswers());
        logger.info("Quiz submitted successfully with submission ID: {}", submission.getId());
        return ResponseEntity.ok(submission);
    }

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
}
