package com.example.lms.controller;

import com.example.lms.dto.SubmissionDTO;
import com.example.lms.entity.AssignmentSubmission;
import com.example.lms.entity.Student;
import com.example.lms.entity.User;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.mapper.AssignmentSubmissionMapper;
import com.example.lms.repository.StudentRepository;
import com.example.lms.repository.UserRepository;
import com.example.lms.service.AssignmentSubmissionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/submissions/assignments")
@RequiredArgsConstructor
public class AssignmentSubmissionController {
    private final UserRepository           userRepo;
    private final StudentRepository        studentRepo;
    private static final Logger logger = LoggerFactory.getLogger(AssignmentSubmissionController.class);
    private final AssignmentSubmissionService submissionService;

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'STUDENT')")
    @PostMapping("/{assignmentId}/students/{studentId}")
    public ResponseEntity<SubmissionDTO> submitAssignment(
            @PathVariable Long assignmentId,
            @PathVariable Long studentId,
            @RequestBody Map<String, String> requestBody) {
        String submissionContent = requestBody.get("submissionContent");
        logger.info("Student ID: {} submitting assignment ID: {}", studentId, assignmentId);

        AssignmentSubmission submission = submissionService.submitAssignment(assignmentId, studentId,
                submissionContent);

        SubmissionDTO dto = AssignmentSubmissionMapper.toDTO(submission);
        return ResponseEntity.ok(dto);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'STUDENT')")
    @PutMapping("/{submissionId}")
    public ResponseEntity<SubmissionDTO> updateSubmission(
            @PathVariable Long submissionId,
            @RequestBody Map<String, String> requestBody) {
        String updatedContent = requestBody.get("submissionContent");
        logger.info("Updating submission ID: {}", submissionId);

        AssignmentSubmission updatedSubmission = submissionService.updateSubmission(submissionId, updatedContent);

        SubmissionDTO dto = AssignmentSubmissionMapper.toDTO(updatedSubmission);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @PutMapping("/{submissionId}/grade")
    public ResponseEntity<SubmissionDTO> gradeSubmission(
            @PathVariable Long submissionId,
            @RequestBody Map<String, Integer> requestBody) {
        int score = requestBody.get("score");
        logger.info("Grading submission with ID: {} with score: {}", submissionId, score);

        AssignmentSubmission gradedSubmission = submissionService.gradeSubmission(submissionId, score);

        SubmissionDTO dto = AssignmentSubmissionMapper.toDTO(gradedSubmission);
        return ResponseEntity.ok(dto);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @GetMapping("/{assignmentId}")
    public ResponseEntity<List<SubmissionDTO>> getSubmissionsForAssignment(@PathVariable Long assignmentId) {
        logger.info("Fetching submissions for assignment ID: {}", assignmentId);

        List<AssignmentSubmission> submissions = submissionService.getSubmissionsByAssignment(assignmentId);

        List<SubmissionDTO> dtos = submissions.stream()
                .map(AssignmentSubmissionMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'STUDENT')")
    @GetMapping("/{assignmentId}/students/{studentId}")
    public ResponseEntity<SubmissionDTO> getStudentSubmission(
            @PathVariable Long assignmentId,
            @PathVariable Long studentId) {
        logger.info("Fetching submission for assignment ID: {} and student ID: {}", assignmentId, studentId);

        AssignmentSubmission submission = submissionService.getSubmissionByAssignmentAndStudent(assignmentId,
                studentId);

        SubmissionDTO dto = AssignmentSubmissionMapper.toDTO(submission);
        return ResponseEntity.ok(dto);
    }
    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/{assignmentId}")
    public ResponseEntity<SubmissionDTO> submitAssignment(
            @PathVariable Long assignmentId,
            @RequestPart("submissionContent") String content,
            @RequestPart(value="file", required=false) MultipartFile file,
            Authentication auth
    ) {
        // 1) find the current Student
        String username = auth.getName();
        User   user    = userRepo.findByUsername(username)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Student student = studentRepo.findByUser(user);
        if (student == null) {
            throw new ResourceNotFoundException("Student record not found for user: " + username);
        }

        // 2) delegate to your service
        AssignmentSubmission sub =
          submissionService.submitAssignment(assignmentId, student.getId(), content, file);

        return ResponseEntity.ok(AssignmentSubmissionMapper.toDTO(sub));
    }
}
