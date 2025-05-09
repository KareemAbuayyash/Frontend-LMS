package com.example.lms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.lms.service.EnrollmentService;

import jakarta.validation.Valid;

import com.example.lms.dto.CourseDTO;
import com.example.lms.dto.EnrollmentDTO;
import com.example.lms.entity.Course;
import com.example.lms.entity.Instructor;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.mapper.CourseMapper;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.InstructorRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private static final Logger logger = LoggerFactory.getLogger(EnrollmentController.class);
    @Autowired
    private EnrollmentService enrollmentService;
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public CollectionModel<EntityModel<EnrollmentDTO>> all() {
        logger.info("Request received to fetch all enrollments");
        CollectionModel<EntityModel<EnrollmentDTO>> enrollments = enrollmentService.findAll();
        logger.info("Fetched {} enrollments", enrollments.getContent().size());
        return enrollments;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/newEnrollment")
    ResponseEntity<?> newEnrollment(@Valid @RequestBody EnrollmentDTO newEnrollment) {
        logger.info("Request received to create a new enrollment for student: {}", newEnrollment.getStudentId());
        ResponseEntity<?> response = enrollmentService.newEnrollment(newEnrollment);
        logger.info("Enrollment created successfully for student: {}", newEnrollment.getStudentId());
        return response;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public EntityModel<EnrollmentDTO> one(@PathVariable Long id) {
        logger.info("Request received to fetch enrollment with ID: {}", id);
        EntityModel<EnrollmentDTO> enrollment = enrollmentService.findById(id);
        logger.info("Enrollment with ID: {} fetched successfully", id);
        return enrollment;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    ResponseEntity<?> replaceEnrollment(@Valid @RequestBody EnrollmentDTO newEnrollment, @PathVariable Long id) {
        logger.info("Request received to update enrollment with ID: {}", id);
        ResponseEntity<?> response = ResponseEntity.ok(enrollmentService.save(newEnrollment, id));
        logger.info("Enrollment with ID: {} updated successfully", id);
        return response;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteEnrollment(@PathVariable Long id) {
        logger.info("Request received to delete enrollment with ID: {}", id);
        ResponseEntity<?> response = enrollmentService.deleteById(id);
        logger.info("Enrollment with ID: {} deleted successfully", id);
        return response;
    }
  
}
