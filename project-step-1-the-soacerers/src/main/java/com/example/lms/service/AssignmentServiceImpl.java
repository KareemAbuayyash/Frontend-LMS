package com.example.lms.service;

import com.example.lms.dto.AssignmentDTO;
import com.example.lms.dto.SubmissionDTO;
import com.example.lms.entity.Assignment;
import com.example.lms.entity.Course;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.mapper.AssignmentMapper;
import com.example.lms.mapper.AssignmentSubmissionMapper;
import com.example.lms.repository.AssignmentRepository;
import com.example.lms.repository.CourseRepository;

import jakarta.persistence.EntityNotFoundException;
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
public class AssignmentServiceImpl implements AssignmentService {
  private final AssignmentRepository assignmentRepo;
  private final CourseRepository courseRepo;
  private final AssignmentSubmissionService submissionService;

  private final Path uploads = Paths.get("uploads");

  @Override
  public AssignmentDTO createAssignmentWithAttachment(Long courseId, AssignmentDTO dto, MultipartFile file) {
    Course course = courseRepo.findById(courseId)
        .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));
    Assignment entity = AssignmentMapper.toEntity(dto, course);

    if (file != null && !file.isEmpty()) {
      try {
        Files.createDirectories(uploads);
        String fn = UUID.randomUUID() + "_" + file.getOriginalFilename();
        try (InputStream in = file.getInputStream()) {
          Files.copy(in, uploads.resolve(fn), StandardCopyOption.REPLACE_EXISTING);
        }
        entity.setAttachmentUrl("/files/" + fn);
      } catch (IOException e) {
        throw new RuntimeException("Failed to store file", e);
      }
    }

    Assignment saved = assignmentRepo.save(entity);
    return AssignmentMapper.toDTO(saved);
  }

  @Override
  public AssignmentDTO createAssignmentForCourse(Long courseId, AssignmentDTO dto) {
    return createAssignmentWithAttachment(courseId, dto, null);
  }

  @Override
  public List<AssignmentDTO> getAssignmentsByCourse(Long courseId) {
    return assignmentRepo.findByCourseId(courseId)
        .stream().map(AssignmentMapper::toDTO).toList();
  }

  @Override
  public AssignmentDTO gradeAssignment(Long assignmentId, int score) {
    Assignment a = assignmentRepo.findById(assignmentId)
        .orElseThrow(() -> new ResourceNotFoundException("Assignment not found: " + assignmentId));
    a.setScore(score);
    a.setGraded(true);
    return AssignmentMapper.toDTO(assignmentRepo.save(a));
  }

  @Override
  public AssignmentDTO getAssignmentById(Long assignmentId) {
    Assignment a = assignmentRepo.findById(assignmentId)
        .orElseThrow(() -> new ResourceNotFoundException("Assignment not found: " + assignmentId));
    return AssignmentMapper.toDTO(a);
  }

  @Override
  public List<SubmissionDTO> getSubmissionsForAssignment(Long assignmentId) {
    return submissionService.getSubmissionsByAssignment(assignmentId)
        .stream().map(AssignmentSubmissionMapper::toDTO).toList();
  }
  @Transactional
  @Override
  public AssignmentDTO updateAssignment(AssignmentDTO dto) {
    Assignment entity = assignmentRepo.findById(dto.getId())
      .orElseThrow(() -> new EntityNotFoundException("Assignment not found"));

    entity.setTitle(dto.getTitle());
    entity.setDescription(dto.getDescription());
    entity.setDueDate(dto.getDueDate());
    entity.setTotalPoints(dto.getTotalPoints());
    // (we’re not touching the file on edit)

    assignmentRepo.save(entity);
    return AssignmentMapper.toDTO(entity);
  }
  @Override
  @Transactional
  public AssignmentDTO updateAssignmentWithAttachment(AssignmentDTO dto, MultipartFile file) {
    Assignment entity = assignmentRepo.findById(dto.getId())
        .orElseThrow(() -> new ResourceNotFoundException("Assignment not found " + dto.getId()));

    // update metadata
    entity.setTitle(dto.getTitle());
    entity.setDescription(dto.getDescription());
    entity.setDueDate(dto.getDueDate());
    entity.setTotalPoints(dto.getTotalPoints());

    // if new file present, delete old + store new
    if (file != null && !file.isEmpty()) {
      // delete old
      String oldUrl = entity.getAttachmentUrl();
      if (oldUrl != null) {
        try {
          Path old = uploads.resolve(Paths.get(oldUrl).getFileName());
          Files.deleteIfExists(old);
        } catch (IOException e) { /* log */ }
      }
      // store new
      try {
        Files.createDirectories(uploads);
        String fn = UUID.randomUUID() + "_" + file.getOriginalFilename();
        try (InputStream in = file.getInputStream()) {
          Files.copy(in, uploads.resolve(fn), StandardCopyOption.REPLACE_EXISTING);
        }
        entity.setAttachmentUrl("/files/" + fn);
      } catch (IOException e) {
        throw new RuntimeException("Failed to store new file", e);
      }
    }

    assignmentRepo.save(entity);
    return AssignmentMapper.toDTO(entity);
  }

  @Override
@Transactional
public void deleteAssignment(Long assignmentId) {
  // 1) blow away all child submissions
  submissionService.deleteSubmissionsByAssignment(assignmentId);

  // 2) delete the file on disk, if any
  Assignment entity = assignmentRepo.findById(assignmentId)
    .orElseThrow(() -> new ResourceNotFoundException("Assignment not found: " + assignmentId));

  String url = entity.getAttachmentUrl();
  if (url != null) {
    try {
      Path p = uploads.resolve(Paths.get(url).getFileName());
      Files.deleteIfExists(p);
    } catch (IOException e) {
      // log and continue
    }
  }

  // 3) **finally remove the assignment row itself**
  assignmentRepo.delete(entity);
}

}
