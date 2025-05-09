package com.example.lms.controller;

import com.example.lms.dto.StudentDTO;
import com.example.lms.dto.StudentUpdateDTO;
import com.example.lms.entity.Student;
import com.example.lms.mapper.StudentMapper;
import com.example.lms.repository.StudentRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    private final StudentRepository studentRepository;

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping
    public List<StudentDTO> getAllStudents() {
        logger.info("Request received to fetch all students");
        List<StudentDTO> students = studentRepository.findAll().stream()
                .map(StudentMapper::toDTO)
                .collect(Collectors.toList());
        logger.info("Fetched {} students", students.size());
        return students;
    }

    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        logger.info("Request received to fetch student with ID: {}", id);
        return studentRepository.findById(id)
                .map(student -> {
                    logger.info("Student with ID: {} found", id);
                    return ResponseEntity.ok(StudentMapper.toDTO(student));
                })
                .orElseGet(() -> {
                    logger.warn("Student with ID: {} not found", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id,
                                                      @Valid @RequestBody StudentUpdateDTO dto) {
        logger.info("Request received to update student with ID: {}", id);
        return studentRepository.findById(id)
                .map(student -> {
                    logger.info("Student with ID: {} found, updating details", id);
                    student.setGrade(dto.getGrade());
                    student.setHobbies(dto.getHobbies());
                    Student savedStudent = studentRepository.save(student);
                    logger.info("Student with ID: {} updated successfully", id);
                    return ResponseEntity.ok(StudentMapper.toDTO(savedStudent));
                })
                .orElseGet(() -> {
                    logger.warn("Student with ID: {} not found", id);
                    return ResponseEntity.notFound().build();
                });
    }

}
