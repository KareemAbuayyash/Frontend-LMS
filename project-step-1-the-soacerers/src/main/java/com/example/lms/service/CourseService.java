package com.example.lms.service;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import com.example.lms.dto.CourseDTO;

public interface CourseService {
    CollectionModel<EntityModel<CourseDTO>> findAll();
    ResponseEntity<?> newCourse(CourseDTO newCourse);
    EntityModel<CourseDTO> findById(Long id);
    ResponseEntity<?> save(CourseDTO newCourse, Long id);
    ResponseEntity<?> deleteById(Long id);
}
