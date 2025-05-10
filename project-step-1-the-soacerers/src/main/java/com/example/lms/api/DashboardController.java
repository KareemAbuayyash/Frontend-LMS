// src/main/java/com/example/lms/api/DashboardController.java
package com.example.lms.api;

import com.example.lms.dto.DashboardStatsDTO;
import com.example.lms.dto.RecentCourseDTO;
import com.example.lms.dto.UserDTO;
import com.example.lms.mapper.UserMapper;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.EnrollmentRepository;
import com.example.lms.repository.InstructorRepository;
import com.example.lms.repository.StudentRepository;
import com.example.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository         userRepository;
    private final CourseRepository       courseRepository;
    private final EnrollmentRepository   enrollmentRepository;
    private final InstructorRepository   instructorRepository;
    private final StudentRepository      studentRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> stats() {
        var dto = new DashboardStatsDTO(
            userRepository.count(),
            courseRepository.count(),
            enrollmentRepository.count(),
            instructorRepository.count(),   
            studentRepository.count() 
        );
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/activity")
    public ResponseEntity<List<UserDTO>> recentUsers(
            @RequestParam(defaultValue = "5") int limit) {

        var users = userRepository
            .findAll(PageRequest.of(0, limit, Sort.by("id").descending()))
            .getContent()
            .stream()
            .map(UserMapper::toDTO)
            .toList();

        return ResponseEntity.ok(users);
    }

    @GetMapping("/recent-courses")
public ResponseEntity<List<RecentCourseDTO>> recentCourses(
        @RequestParam(defaultValue = "5") int limit
) {
    var courses = courseRepository
        .findAll(PageRequest.of(0, limit, Sort.by("id").descending()))
        .getContent();

    var dtos = courses.stream().map(c -> {
        String instructorName = Optional.ofNullable(c.getInstructor())
            // ← grab the User.username, not the (often-null) Instructor.name
            .map(i -> i.getUser().getUsername())
            .orElse(c.getCourseInstructor());

        int enrolled = (int) enrollmentRepository.countByCourseId(c.getId());
        return new RecentCourseDTO(
            c.getId(),
            c.getCourseName(),
            instructorName,
            enrolled
        );
    }).toList();

    return ResponseEntity.ok(dtos);
}

}
