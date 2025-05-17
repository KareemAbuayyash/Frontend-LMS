package com.example.lms.service;

import com.example.lms.dto.AssignmentDTO;
import com.example.lms.dto.SubmissionDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AssignmentService {
  AssignmentDTO createAssignmentForCourse(Long courseId, AssignmentDTO dto);
  AssignmentDTO createAssignmentWithAttachment(Long courseId, AssignmentDTO dto, MultipartFile file);
  List<AssignmentDTO> getAssignmentsByCourse(Long courseId);
  AssignmentDTO gradeAssignment(Long assignmentId, int score);
  AssignmentDTO getAssignmentById(Long assignmentId);
  List<SubmissionDTO> getSubmissionsForAssignment(Long assignmentId);
    AssignmentDTO updateAssignment(AssignmentDTO dto);
AssignmentDTO updateAssignmentWithAttachment(AssignmentDTO dto, MultipartFile file);
  void deleteAssignment(Long assignmentId);
  
}
