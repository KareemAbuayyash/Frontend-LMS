package com.example.lms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.lms.service.CourseService;

import jakarta.validation.Valid;

import com.example.lms.audit.SystemActivityService;
import com.example.lms.dto.CourseDTO;
import com.example.lms.entity.Course;
import com.example.lms.entity.Instructor;
import com.example.lms.exception.DuplicateAssociationException;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.mapper.CourseMapper;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.InstructorRepository;
import com.example.lms.repository.StudentRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);

    @Autowired
    private CourseService courseService;
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private InstructorRepository instructorRepository;
    @Autowired
    private  SystemActivityService systemActivityService;

    @Autowired
    private StudentRepository studentRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public CollectionModel<EntityModel<CourseDTO>> all() {
        logger.info("Request received to fetch all courses");
        CollectionModel<EntityModel<CourseDTO>> courses = courseService.findAll();
        logger.info("Fetched {} courses", courses.getContent().size());
        return courses;
    }

  @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/newCourse")
    public ResponseEntity<?> newCourse(@Valid @RequestBody CourseDTO newCourse) {
        logger.info("Request received to create a new course: {}", newCourse.getCourseName());

        // Delegate to service
        ResponseEntity<?> response = courseService.newCourse(newCourse);

        // If creation succeeded, log into system activity
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() instanceof EntityModel) {
            @SuppressWarnings("unchecked")
            EntityModel<CourseDTO> model = (EntityModel<CourseDTO>) response.getBody();
            CourseDTO created = model.getContent();
            if (created != null && created.getCourseId() != null) {
                systemActivityService.logEvent(
                  "COURSE_CREATED",
                  String.format("Course '%s' (ID: %d) was created", 
                                created.getCourseName(), created.getCourseId())
                );
            }
        }

        return response;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public EntityModel<CourseDTO> one(@PathVariable Long id) {
        logger.info("Request received to fetch course with ID: {}", id);
        EntityModel<CourseDTO> course = courseService.findById(id);
        logger.info("Course with ID: {} fetched successfully", id);
        return course;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    ResponseEntity<?> replaceCourse(@Valid @RequestBody CourseDTO newCourse, @PathVariable Long id) {
        logger.info("Request received to update course with ID: {}", id);
        ResponseEntity<?> response = ResponseEntity.ok(courseService.save(newCourse, id));
        logger.info("Course with ID: {} updated successfully", id);
        return response;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        logger.info("Request received to delete course with ID: {}", id);
        ResponseEntity<?> response = courseService.deleteById(id);
        logger.info("Course with ID: {} deleted successfully", id);
        return response;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{courseId}/assignInstructor/{instructorId}")
    public ResponseEntity<CourseDTO> assignInstructorToCourse(
            @PathVariable Long courseId,
            @PathVariable Long instructorId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + courseId));

        Instructor instructor = instructorRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found with id " + instructorId));
        if (course.getInstructor() != null
                && course.getInstructor().getId().equals(instructorId)) {
            throw new DuplicateAssociationException(
                    "Instructor with ID " + instructorId +
                            " is already assigned to course ID " + courseId);
        }
        course.setInstructor(instructor);
        Course updatedCourse = courseRepository.save(course);

        return ResponseEntity.ok(CourseMapper.toDTO(updatedCourse));
    }

    @GetMapping("/{courseId}/enrollment-count")
public ResponseEntity<Long> getEnrollmentCount(@PathVariable Long courseId) {
    long count = studentRepository.countByEnrolledCourses_Id(courseId);
    return ResponseEntity.ok(count);
}


}
