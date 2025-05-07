package com.example.lms.service;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import com.example.lms.dto.EnrollmentDTO;

public interface EnrollmentService {
    CollectionModel<EntityModel<EnrollmentDTO>> findAll();
    ResponseEntity<?> newEnrollment(EnrollmentDTO newEnrollment);
    EntityModel<EnrollmentDTO> findById(Long id);
    ResponseEntity<?> save(EnrollmentDTO newEnrollment, Long id);
    ResponseEntity<?> deleteById(Long id);
}
