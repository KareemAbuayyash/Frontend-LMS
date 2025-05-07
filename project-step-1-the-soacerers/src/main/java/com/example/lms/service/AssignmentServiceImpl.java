package com.example.lms.service;

import com.example.lms.dto.AssignmentDTO;
import com.example.lms.entity.Assignment;
import com.example.lms.entity.Course;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.mapper.AssignmentMapper;
import com.example.lms.repository.AssignmentRepository;
import com.example.lms.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {

  private static final Logger logger = LoggerFactory.getLogger(AssignmentServiceImpl.class);

  private final AssignmentRepository assignmentRepository;
  private final CourseRepository courseRepository;

  @Override
  public Assignment createAssignment(Assignment assignment) {
    logger.info("Creating a new assignment with title: {}", assignment.getTitle());
    Assignment savedAssignment = assignmentRepository.save(assignment);
    logger.info("Assignment created successfully with ID: {}", savedAssignment.getId());
    return savedAssignment;
  }

  @Override
  public AssignmentDTO gradeAssignment(Long assignmentId, int score) {
    logger.info("Grading assignment with ID: {} to score: {}", assignmentId, score);
    Assignment assignment = assignmentRepository.findById(assignmentId)
        .orElseThrow(() -> new ResourceNotFoundException(
            "Assignment not found with ID: " + assignmentId));

    assignment.setScore(score);
    assignment.setGraded(true);

    Assignment saved = assignmentRepository.save(assignment);
    logger.info("Assignment {} graded successfully", assignmentId);

    return AssignmentMapper.toDTO(saved);
  }

  @Override
  public Assignment getAssignmentById(Long assignmentId) {
    logger.info("Fetching assignment with ID: {}", assignmentId);
    Assignment assignment = assignmentRepository.findById(assignmentId)
        .orElseThrow(() -> {
          logger.error("Assignment with ID: {} not found", assignmentId);
          return new ResourceNotFoundException("Assignment not found");
        });
    logger.info("Assignment with ID: {} fetched successfully", assignmentId);
    return assignment;
  }

  @Override
  public List<Assignment> getAssignmentsByCourse(Long courseId) {
    logger.info("Fetching assignments for course with ID: {}", courseId);
    List<Assignment> assignments = assignmentRepository.findByCourseId(courseId);
    logger.info("Fetched {} assignments for course with ID: {}", assignments.size(), courseId);
    return assignments;
  }

  @Override
  public AssignmentDTO createAssignmentForCourse(Long courseId, AssignmentDTO dto) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));
    Assignment assignment = AssignmentMapper.toEntity(dto, course);
    Assignment saved = assignmentRepository.save(assignment);
    return AssignmentMapper.toDTO(saved);
  }
}
