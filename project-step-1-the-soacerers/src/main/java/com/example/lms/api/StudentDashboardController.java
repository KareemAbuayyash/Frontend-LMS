// src/main/java/com/example/lms/api/StudentDashboardController.java
package com.example.lms.api;

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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentDashboardController {
  @Autowired
    private final EnrollmentRepository   enrollmentRepo;
    @Autowired
    private final AssignmentRepository   assignmentRepo;
    @Autowired
    private final SubmissionRepository   submissionRepo;
    @Autowired
    private final StudentRepository      studentRepo;
    @Autowired
    private  CourseMapper           courseMapper;

    // 1) List the student's courses
    @GetMapping("/courses")
    public ResponseEntity<List<CourseDTO>> myCourses(Authentication auth) {
        User    user    = (User) auth.getPrincipal();
        Student student = studentRepo.findByUser(user);

        List<CourseDTO> dtos = student.getEnrolledCourses().stream()
            .map(courseMapper::toDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // 2) List that student's assignments (with a "submitted" flag)
    @GetMapping("/assignments")
    public ResponseEntity<List<Map<String, Object>>> myAssignments(Authentication auth) {
        User    user    = (User) auth.getPrincipal();
        Student student = studentRepo.findByUser(user);

        // find all assignments in any of their courses
        Set<Long> courseIds = student.getEnrolledCourses()
                                     .stream()
                                     .map(Course::getId)
                                     .collect(Collectors.toSet());

        List<Assignment> assignments = assignmentRepo.findAll()
            .stream()
            .filter(a -> courseIds.contains(a.getCourse().getId()))
            .collect(Collectors.toList());

        List<Map<String, Object>> result = assignments.stream()
            .map(a -> {
                boolean submitted = submissionRepo
                    .findByAssignment_IdAndStudentId(a.getId(), student.getId())
                    != null;

                return Map.<String,Object>of(
                    "id",         a.getId(),
                    "title",      a.getTitle(),
                    "courseName", a.getCourse().getCourseName(),
                    "dueDate",    a.getDueDate(),
                    "submitted",  submitted
                );
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // 3) Stats for the dashboard
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats(Authentication auth) {
        User    user            = (User) auth.getPrincipal();
        Student student         = studentRepo.findByUser(user);

        long totalCourses       = student.getEnrolledCourses().size();
        long completedCourses   = student.getEnrolledCourses().stream()
                                         .filter(c -> c.isCompleted()) // or pull from Enrollment
                                         .count();
        long pendingAssignments = submissionRepo.findByStudentId(student.getId())
                                                .stream()
                                                .filter(s -> !s.isGraded())
                                                .count();
        double averageGrade     = submissionRepo.findByStudentId(student.getId())
                                                .stream()
                                                .mapToInt(Submission::getScore)
                                                .average()
                                                .orElse(0.0);

        Map<String,Object> stats = new HashMap<>();
        stats.put("totalCourses",      totalCourses);
        stats.put("completedCourses",  completedCourses);
        stats.put("pendingAssignments",pendingAssignments);
        stats.put("averageGrade",      averageGrade);

        return ResponseEntity.ok(stats);
    }
}
