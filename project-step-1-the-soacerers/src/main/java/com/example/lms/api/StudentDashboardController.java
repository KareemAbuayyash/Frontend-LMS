package com.example.lms.api;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.lms.dto.CourseDTO;
import com.example.lms.entity.Assignment;
import com.example.lms.entity.Course;
import com.example.lms.entity.Student;
import com.example.lms.entity.Submission;
import com.example.lms.entity.User;
import com.example.lms.mapper.CourseMapper;
import com.example.lms.repository.AssignmentRepository;
import com.example.lms.repository.EnrollmentRepository;
import com.example.lms.repository.StudentRepository;
import com.example.lms.repository.SubmissionRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentDashboardController {

  @Autowired
  private EnrollmentRepository enrollmentRepo;
  @Autowired
  private AssignmentRepository assignmentRepo;
  @Autowired
  private SubmissionRepository submissionRepo;
  @Autowired
  private StudentRepository studentRepo;

  // 1) List the student's courses
  @GetMapping("/courses")
  public ResponseEntity<List<CourseDTO>> myCourses(Authentication auth) {
    // find the Student by auth.getName()
    User user = (User) auth.getPrincipal();
    Student student = studentRepo.findByUser(user);
    var dtos = student.getEnrolledCourses()
                     .stream()
                     .map(CourseMapper::toDTO)
                     .toList();
    return ResponseEntity.ok(dtos);
  }

  // 2) List that student's assignments (with a "submitted" flag)
  @GetMapping("/assignments")
  public ResponseEntity<List<Map<String,Object>>> myAssignments(Authentication auth) {
    User user = (User) auth.getPrincipal();
    Student student = studentRepo.findByUser(user);

    // fetch all assignments in the student's courses
    List<Assignment> assignments = assignmentRepo.findAll()
      .stream()
      .filter(a -> student.getEnrolledCourses()
                          .stream()
                          .anyMatch(c -> c.getId().equals(a.getCourse().getId())))
      .toList();

    // now map to a DTO including whether they've submitted
    var list = assignments.stream().map(a -> {
      boolean submitted = submissionRepo
        .findByAssignment_IdAndStudentId(a.getId(), student.getId())
        != null;
      return Map.of(
        "id",            a.getId(),
        "title",         a.getTitle(),
        "courseName",    a.getCourse().getCourseName(),
        "dueDate",       a.getDueDate(),
        "submitted",     submitted
      );
    }).toList();

    return ResponseEntity.ok((List<Map<String, Object>>) (List<?>) list);
  }

  // 3) Stats for the dashboard
  @GetMapping("/stats")
  public ResponseEntity<Map<String, Object>> stats(Authentication auth) {
    User user = (User) auth.getPrincipal();
    Student student = studentRepo.findByUser(user);

    long totalCourses = student.getEnrolledCourses().size();
    long completedCourses = student.getEnrolledCourses().stream()
                                   .filter(Course::isCompleted) // you'd need a flag on Course or Enrollment
                                   .count();
    long pendingAssignments = submissionRepo.findByStudentId(student.getId())
      .stream()
      .filter(s -> !s.isGraded())
      .count();
    double averageGrade = submissionRepo.findByStudentId(student.getId())
      .stream()
      .mapToInt(Submission::getScore)
      .average()
      .orElse(0.0);

    var stats = Map.<String,Object>of(
      "totalCourses",      totalCourses,
      "completedCourses",  completedCourses,
      "pendingAssignments",pendingAssignments,
      "averageGrade",      averageGrade
    );
    return ResponseEntity.ok(stats);
  }
}

