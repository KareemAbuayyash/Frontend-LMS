package com.example.lms.controller;

import com.example.lms.dto.AssignmentDTO;
import com.example.lms.dto.ScoreRequest;
import com.example.lms.entity.Assignment;
import com.example.lms.entity.Course;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.mapper.AssignmentMapper;
import com.example.lms.repository.CourseRepository;
import com.example.lms.service.AssignmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignments")
@RequiredArgsConstructor
public class AssignmentController {

  private static final Logger logger = LoggerFactory.getLogger(AssignmentController.class);

  private final AssignmentService assignmentService;
  private final CourseRepository courseRepository;

  @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
  @PostMapping("/course/{courseId}")
  public ResponseEntity<AssignmentDTO> createAssignmentForCourse(
      @PathVariable Long courseId,
      @Valid @RequestBody AssignmentDTO assignmentDTO) {
    AssignmentDTO created = assignmentService.createAssignmentForCourse(courseId, assignmentDTO);
    return ResponseEntity.ok(created);
  }

  @GetMapping("/course/{courseId}")
  public ResponseEntity<List<AssignmentDTO>> getAssignmentsForCourse(@PathVariable Long courseId) {
    List<AssignmentDTO> dtos = assignmentService
        .getAssignmentsByCourse(courseId)
        .stream()
        .map(AssignmentMapper::toDTO)
        .toList();
    return ResponseEntity.ok(dtos);
  }

  @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
  @PutMapping("/{assignmentId}/grade")
  public ResponseEntity<AssignmentDTO> gradeAssignment(
      @PathVariable Long assignmentId,
      @Valid @RequestBody ScoreRequest scoreRequest) {
    logger.info("Received grading request for assignment {}: score={}", assignmentId, scoreRequest.getScore());
    AssignmentDTO dto = assignmentService.gradeAssignment(assignmentId, scoreRequest.getScore());
    return ResponseEntity.ok(dto);
  }

  @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'STUDENT')")
  @GetMapping("/{assignmentId}")
  public ResponseEntity<AssignmentDTO> getAssignmentById(@PathVariable Long assignmentId) {
    logger.info("Fetching assignment by ID: {}", assignmentId);

    Assignment assignment = assignmentService.getAssignmentById(assignmentId);

    AssignmentDTO dto = AssignmentMapper.toDTO(assignment);
    return ResponseEntity.ok(dto);
  }
}
