// src/main/java/com/example/lms/api/StudentQuizController.java
package com.example.lms.api;

import com.example.lms.dto.SubmissionResponse;
import com.example.lms.entity.Student;
import com.example.lms.entity.Submission;
import com.example.lms.entity.User;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.mapper.SubmissionMapper;
import com.example.lms.repository.StudentRepository;
import com.example.lms.repository.SubmissionRepository;
import com.example.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students/quizzes")
@RequiredArgsConstructor
public class StudentQuizController {

    private final SubmissionRepository submissionRepo;
    private final UserRepository userRepo;
    private final StudentRepository studentRepo;

    /**
     * Fetch the current student's submission (with score) for a given quiz.
     * Returns 404 if no submission exists yet.
     */
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/{quizId}/submission")
    public ResponseEntity<SubmissionResponse> getMyQuizSubmission(
            @PathVariable Long quizId,
            Authentication auth
    ) {
        // 1) Identify the user & student
        String username = auth.getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Student student = studentRepo.findByUser(user);
        if (student == null) {
            throw new ResourceNotFoundException("Student record not found for user: " + username);
        }

        // 2) Look up their Submission for this quiz
        List<Submission> submissions = submissionRepo
            .findByQuizIdAndStudentId(quizId, student.getId());
        Submission submission = submissions.isEmpty() ? null : submissions.get(0);
        if (submission == null) {
            return ResponseEntity.notFound().build();
        }

        // 3) Map to DTO (includes score & graded flag)
        SubmissionResponse dto = SubmissionMapper.toResponse(submission);
        return ResponseEntity.ok(dto);
    }
}
