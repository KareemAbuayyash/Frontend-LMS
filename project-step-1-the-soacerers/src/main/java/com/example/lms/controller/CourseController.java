package com.example.lms.controller;

import com.example.lms.dto.CourseDTO;
import com.example.lms.service.CourseService;
import com.example.lms.audit.SystemActivityService;
import com.example.lms.notification.Notification;
import com.example.lms.notification.NotificationService;
import com.example.lms.notification.NotificationType;
import com.example.lms.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);

    private final CourseService      courseService;
    private final SystemActivityService activity;
    private final AdminRepository    adminRepo;
    private final NotificationService notificationService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public CollectionModel<EntityModel<CourseDTO>> all() {
        logger.info("Fetching all courses");
        return courseService.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/newCourse")
    public ResponseEntity<?> newCourse(
        @Valid @RequestBody CourseDTO dto,
        Authentication auth
    ) {
        String actor = auth.getName();
        ResponseEntity<?> resp = courseService.newCourse(dto);

        // … your existing audit + notify‐admins block …

        return resp;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public EntityModel<CourseDTO> one(@PathVariable Long id) {
        return courseService.findById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> replaceCourse(
        @Valid @RequestBody CourseDTO dto,
        @PathVariable Long id,
        Authentication auth
    ) {
        String actor = auth.getName();
        ResponseEntity<?> resp = courseService.save(dto, id);

        // … your existing audit + notify‐admins block …

        return resp;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(
        @PathVariable Long id,
        Authentication auth
    ) {
        String actor = auth.getName();
        // … you already have delete + audit + notify …
        return courseService.deleteById(id);
    }
}
