package com.example.lms.service;

import com.example.lms.dto.AssignmentDTO;
import com.example.lms.entity.Assignment;
import java.util.List;

public interface AssignmentService {
  Assignment createAssignment(Assignment assignment);

  Assignment getAssignmentById(Long assignmentId);

  AssignmentDTO  gradeAssignment(Long assignmentId, int score);

  List<Assignment> getAssignmentsByCourse(Long courseId);

  AssignmentDTO createAssignmentForCourse(Long courseId, AssignmentDTO dto);

}
