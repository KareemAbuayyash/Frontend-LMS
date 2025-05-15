package com.example.lms.controller;

import com.example.lms.dto.CourseDTO;
import com.example.lms.dto.InstructorDTO;
import com.example.lms.dto.InstructorSummaryDTO;
import com.example.lms.dto.InstructorUpdateDTO;
import com.example.lms.dto.RecentCourseDTO;
import com.example.lms.entity.Instructor;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.mapper.InstructorMapper;
import com.example.lms.repository.EnrollmentRepository;
import com.example.lms.repository.InstructorRepository;
import com.example.lms.service.InstructorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/instructors")
@RequiredArgsConstructor
public class InstructorController {

    private static final Logger logger = LoggerFactory.getLogger(InstructorController.class);

    private final InstructorService instructorService;
    private final InstructorRepository instructorRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final InstructorMapper instructorMapper;
    private final com.example.lms.service.CourseService courseService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<InstructorSummaryDTO> getAllInstructors() {
        return instructorRepository.findAll().stream()
            .map(i -> new InstructorSummaryDTO(i.getId(), i.getUser().getUsername()))
            .collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<InstructorDTO> getInstructorById(@PathVariable Long id) {
        InstructorDTO dto = instructorService.getInstructorById(id);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<InstructorDTO> updateInstructor(@PathVariable Long id,
        @Valid @RequestBody InstructorUpdateDTO dto) {
        logger.info("Request received to update instructor with ID: {}", id);
        InstructorDTO updated = instructorService.updateInstructor(id, dto);
        logger.info("Instructor with ID: {} updated successfully", id);
        return ResponseEntity.ok(updated);
    }

    /**
     * For admins or instructor by ID: list courses with enrollment counts
     */
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @GetMapping("/{id}/courses")
    public ResponseEntity<List<RecentCourseDTO>> getCoursesByInstructor(@PathVariable Long id) {
        Instructor inst = instructorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Instructor not found with id " + id));

        List<RecentCourseDTO> dtos = inst.getCourses().stream()
            .map(c -> new RecentCourseDTO(
                    c.getId(),
                    c.getCourseName(),
                    inst.getUser().getUsername(),
                    (int) enrollmentRepository.countByCourseId(c.getId())
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    /**
     * For authenticated instructor: list their own courses with counts
     */
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @GetMapping("/me/courses")
    public ResponseEntity<List<RecentCourseDTO>> getMyCourses(Authentication auth) {
        var user = (com.example.lms.entity.User) auth.getPrincipal();
        Instructor inst = instructorRepository.findByUser(user);
        if (inst == null) {
            throw new ResourceNotFoundException("Instructor record not found for user: " + user.getUsername());
        }

        List<RecentCourseDTO> dtos = inst.getCourses().stream()
            .map(c -> new RecentCourseDTO(
                    c.getId(),
                    c.getCourseName(),
                    user.getUsername(),
                    (int) enrollmentRepository.countByCourseId(c.getId())
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
    @PreAuthorize("hasRole('INSTRUCTOR')")
  @GetMapping("/courses")
  public ResponseEntity<List<CourseDTO>> myCourses(Principal principal) {
    String username = principal.getName();
    List<CourseDTO> dtos = courseService.findByInstructorUsername(username);
    return ResponseEntity.ok(dtos);
  }
}
