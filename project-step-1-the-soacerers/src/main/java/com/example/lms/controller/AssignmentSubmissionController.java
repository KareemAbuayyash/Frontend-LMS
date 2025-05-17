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
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/submissions/assignments")
@RequiredArgsConstructor
public class AssignmentSubmissionController {
  private static final Logger logger = LoggerFactory.getLogger(AssignmentSubmissionController.class);

  private final AssignmentSubmissionService submissionService;
  private final UserRepository userRepo;
  private final StudentRepository studentRepo;

  /**
   * Student submits an assignment with an optional file.
   */
  @PreAuthorize("hasRole('STUDENT')")
  @PostMapping(
    path = "/{assignmentId}",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
  )
  public ResponseEntity<SubmissionDTO> submitAssignment(
    @PathVariable Long assignmentId,
    @RequestPart("submissionContent") String content,
    @RequestPart(value = "file", required = false) MultipartFile file,
    Authentication auth
  ) {
    // 1) Lookup the current student
    String username = auth.getName();
    User user = userRepo.findByUsername(username)
      .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    Student student = studentRepo.findByUser(user);
    if (student == null) {
      throw new ResourceNotFoundException("Student record not found for user: " + username);
    }

    logger.info("Student {} submits assignment {} (file attached? {})",
      student.getId(), assignmentId, (file != null));
    AssignmentSubmission saved = submissionService.submitAssignment(
      assignmentId, student.getId(), content, file
    );
    SubmissionDTO dto = AssignmentSubmissionMapper.toDTO(saved);
    return ResponseEntity.ok(dto);
  }

  /**
   * Instructors/Admins fetch all submissions for an assignment.
   */
  @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
  @GetMapping("/{assignmentId}")
  public ResponseEntity<List<SubmissionDTO>> getSubmissionsForAssignment(
    @PathVariable Long assignmentId
  ) {
    logger.info("Fetching submissions for assignment {}", assignmentId);
    List<AssignmentSubmission> subs = submissionService.getSubmissionsByAssignment(assignmentId);
    List<SubmissionDTO> dtos = subs.stream()
      .map(AssignmentSubmissionMapper::toDTO)
      .toList();
    return ResponseEntity.ok(dtos);
  }

  /**
   * Instructors/Admins grade a submission.
   */
  @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
  @PutMapping("/{submissionId}/grade")
  public ResponseEntity<SubmissionDTO> gradeSubmission(
    @PathVariable Long submissionId,
    @Valid @RequestBody com.example.lms.dto.ScoreRequest req
  ) {
    logger.info("Grading submission {} → {}", submissionId, req.getScore());
    AssignmentSubmission graded = submissionService.gradeSubmission(submissionId, req.getScore());
    return ResponseEntity.ok(AssignmentSubmissionMapper.toDTO(graded));
  }
}
