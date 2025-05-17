package com.example.lms.service;

import com.example.lms.entity.Assignment;
import com.example.lms.entity.AssignmentSubmission;
import com.example.lms.entity.Student;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.AssignmentRepository;
import com.example.lms.repository.AssignmentSubmissionRepository;
import com.example.lms.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssignmentSubmissionServiceImpl implements AssignmentSubmissionService {
  private final AssignmentSubmissionRepository subRepo;
  private final AssignmentRepository aRepo;
  private final StudentRepository studentRepo;

  private final Path uploads = Paths.get("uploads");

  @Override
  public AssignmentSubmission submitAssignment(Long assignmentId, Long studentId, String content, MultipartFile file) {
    Assignment a = aRepo.findById(assignmentId)
        .orElseThrow(() -> new ResourceNotFoundException("Assignment not found: " + assignmentId));
    Student s = studentRepo.findById(studentId)
        .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

    AssignmentSubmission sub = new AssignmentSubmission();
    sub.setAssignment(a);
    sub.setStudent(s);
    sub.setSubmissionContent(content);
    sub.setSubmissionDate(LocalDateTime.now());
    sub.setScore(0);
    sub.setGraded(false);

    if (file != null && !file.isEmpty()) {
      try {
        Files.createDirectories(uploads);
        String fn = UUID.randomUUID() + "_" + file.getOriginalFilename();
        try (InputStream in = file.getInputStream()) {
          Files.copy(in, uploads.resolve(fn), StandardCopyOption.REPLACE_EXISTING);
        }
        sub.setFileUrl("/files/" + fn);
      } catch (IOException e) {
        throw new RuntimeException("Failed to store submission file", e);
      }
    }

    return subRepo.save(sub);
  }

  @Override
  public AssignmentSubmission gradeSubmission(Long submissionId, int score) {
    AssignmentSubmission sub = subRepo.findById(submissionId)
        .orElseThrow(() -> new ResourceNotFoundException("Submission not found: " + submissionId));
    sub.setScore(score);
    sub.setGraded(true);
    return subRepo.save(sub);
  }

  @Override
  public List<AssignmentSubmission> getSubmissionsByAssignment(Long assignmentId) {
    return subRepo.findByAssignmentId(assignmentId);
  }
  @Override
  @Transactional
  public void deleteSubmissionsByAssignment(Long assignmentId) {
    subRepo.deleteByAssignmentId(assignmentId);
  }
}
