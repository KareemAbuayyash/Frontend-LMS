package com.example.lms.controller;

import com.example.lms.dto.InstructorDTO;
import com.example.lms.dto.InstructorSummaryDTO;
import com.example.lms.dto.InstructorUpdateDTO;
import com.example.lms.entity.Course;
import com.example.lms.entity.Instructor;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.mapper.InstructorMapper;
import com.example.lms.repository.InstructorRepository;
import com.example.lms.service.InstructorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/instructors")
@RequiredArgsConstructor
public class InstructorController {

  private static final Logger logger = LoggerFactory.getLogger(InstructorController.class);
  @Autowired
  private InstructorService instructorService;
  private final InstructorRepository instructorRepository;
  private final InstructorMapper instructorMapper;

  // @PreAuthorize("hasRole('ADMIN')")
  // @GetMapping
  // public List<Instructor> getAllInstructors() {
  //   logger.info("Request received to fetch all instructors");
  //   List<Instructor> instructors = instructorRepository.findAll();
  //   logger.info("Fetched {} instructors", instructors.size());
  //   return instructors;
  // }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping
  public List<InstructorSummaryDTO> getAllInstructors() {
    return instructorRepository.findAll().stream()
        .map(i -> new InstructorSummaryDTO(
            i.getId(),
            // pull the human-readable name from the joined User
            i.getUser().getUsername()))
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

}
