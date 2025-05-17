package com.example.lms.service;

import com.example.lms.entity.AssignmentSubmission;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AssignmentSubmissionService {
  AssignmentSubmission submitAssignment(Long assignmentId, Long studentId, String content, MultipartFile file);
  AssignmentSubmission gradeSubmission(Long submissionId, int score);
  List<AssignmentSubmission> getSubmissionsByAssignment(Long assignmentId);
  void deleteSubmissionsByAssignment(Long assignmentId);
}
