// src/main/java/com/example/lms/api/DashboardController.java
package com.example.lms.api;

import com.example.lms.dto.DashboardStatsDTO;
import com.example.lms.dto.UserDTO;
import com.example.lms.mapper.UserMapper;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.EnrollmentRepository;
import com.example.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> stats() {
        var dto = new DashboardStatsDTO(
            userRepository.count(),
            courseRepository.count(),
            enrollmentRepository.count()
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
}
