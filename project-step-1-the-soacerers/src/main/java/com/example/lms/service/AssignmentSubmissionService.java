package com.example.lms.service;

import com.example.lms.entity.AssignmentSubmission;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface AssignmentSubmissionService {
    AssignmentSubmission submitAssignment(Long assignmentId, Long studentId, String submissionContent);
    AssignmentSubmission updateSubmission(Long submissionId, String updatedContent);
    AssignmentSubmission gradeSubmission(Long submissionId, int score);
    List<AssignmentSubmission> getSubmissionsByAssignment(Long assignmentId);
    AssignmentSubmission getSubmissionByAssignmentAndStudent(Long assignmentId, Long studentId);
     AssignmentSubmission submitAssignment(Long assignmentId, Long studentId, String content, MultipartFile file) ;
}
