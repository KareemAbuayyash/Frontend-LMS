package com.example.lms.controller;

import com.example.lms.dto.SubmissionDTO;
import com.example.lms.entity.AssignmentSubmission;
import com.example.lms.mapper.AssignmentSubmissionMapper;
import com.example.lms.service.AssignmentSubmissionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/submissions/assignments")
@RequiredArgsConstructor
public class AssignmentSubmissionController {

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
}
