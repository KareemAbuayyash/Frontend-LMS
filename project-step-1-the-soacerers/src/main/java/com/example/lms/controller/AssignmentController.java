package com.example.lms.controller;

import com.example.lms.dto.AssignmentDTO;
import com.example.lms.dto.ScoreRequest;
import com.example.lms.dto.SubmissionDTO;
import com.example.lms.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {
  private static final Logger logger = LoggerFactory.getLogger(AssignmentController.class);
  private final AssignmentService assignmentService;

  /**
   * Create new assignment (with optional attachment)
   */
  @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
  @PostMapping(
    path = "/course/{courseId}",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
  )
  public ResponseEntity<AssignmentDTO> createAssignmentForCourse(
      @PathVariable Long courseId,
      @RequestPart("assignment") @Valid AssignmentDTO dto,
      @RequestPart(value = "file", required = false) MultipartFile file
  ) {
    // inject path-variable before business logic
    dto.setCourseId(courseId);
    AssignmentDTO created = assignmentService.createAssignmentWithAttachment(courseId, dto, file);
    return ResponseEntity.ok(created);
  }

  /**
   * List all assignments in a course
   */
  @GetMapping("/course/{courseId}")
  public ResponseEntity<List<AssignmentDTO>> getAssignmentsForCourse(@PathVariable Long courseId) {
    return ResponseEntity.ok(assignmentService.getAssignmentsByCourse(courseId));
  }

  /**
   * Grade an assignment (sets scored + graded flag)
   */
  @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
  @PutMapping("/{assignmentId}/grade")
  public ResponseEntity<AssignmentDTO> gradeAssignment(
      @PathVariable Long assignmentId,
      @Valid @RequestBody ScoreRequest req
  ) {
    logger.info("Grading assignment {} → {}", assignmentId, req.getScore());
    return ResponseEntity.ok(
      assignmentService.gradeAssignment(assignmentId, req.getScore())
    );
  }

  /**
   * Fetch single assignment
   */
  @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR','STUDENT')")
  @GetMapping("/{assignmentId}")
  public ResponseEntity<AssignmentDTO> getAssignmentById(@PathVariable Long assignmentId) {
    return ResponseEntity.ok(assignmentService.getAssignmentById(assignmentId));
  }

  /**
   * List all submissions for an assignment
   */
  @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
  @GetMapping("/{assignmentId}/submissions")
  public ResponseEntity<List<SubmissionDTO>> getSubmissionsForAssignment(
      @PathVariable Long assignmentId
  ) {
    logger.info("Fetching submissions for assignment {}", assignmentId);
    return ResponseEntity.ok(
      assignmentService.getSubmissionsForAssignment(assignmentId)
    );
  }
  @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
  @PutMapping(
    path = "/{assignmentId}",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
  )
  public ResponseEntity<AssignmentDTO> updateAssignment(
      @PathVariable Long assignmentId,
      @RequestPart("assignment") @Valid AssignmentDTO dto,
      @RequestPart(value = "file", required = false) MultipartFile file
  ) {
    dto.setId(assignmentId);
    AssignmentDTO updated = assignmentService.updateAssignmentWithAttachment(dto, file);
    return ResponseEntity.ok(updated);
  }

  /**
   * Delete an assignment (and its file)
   */
  @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
  @DeleteMapping("/{assignmentId}")
  public ResponseEntity<Void> deleteAssignment(@PathVariable Long assignmentId) {
    assignmentService.deleteAssignment(assignmentId);
    return ResponseEntity.noContent().build();
  }
  
}
