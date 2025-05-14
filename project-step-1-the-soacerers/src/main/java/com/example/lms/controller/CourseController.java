package com.example.lms.controller;

import com.example.lms.assembler.CourseModelAssembler;
import com.example.lms.dto.CourseDTO;
import com.example.lms.entity.Course;
import com.example.lms.entity.Instructor;
import com.example.lms.exception.DuplicateAssociationException;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.mapper.CourseMapper;
import com.example.lms.notification.Notification;
import com.example.lms.notification.NotificationService;
import com.example.lms.notification.NotificationType;
import com.example.lms.repository.AdminRepository;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.InstructorRepository;
import com.example.lms.repository.StudentRepository;
import com.example.lms.service.CourseService;
import com.example.lms.audit.SystemActivityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);

    @Autowired private CourseService courseService;
    @Autowired private CourseRepository courseRepository;
    @Autowired private AdminRepository adminRepository;
    @Autowired private InstructorRepository instructorRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private SystemActivityService activity;
    @Autowired private NotificationService notificationService;

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
    public ResponseEntity<?> newCourse(
            @Valid @RequestBody CourseDTO newCourse,
            Authentication authentication) {

        ResponseEntity<?> response = courseService.newCourse(newCourse);

        if (response.getStatusCode().is2xxSuccessful()
            && response.getBody() instanceof EntityModel<?> model
            && model.getContent() instanceof CourseDTO created) {

            String actor = authentication.getName();

            // ─── Audit ────────────────────────────────────────────────────────
            activity.logEvent(
                "COURSE_CREATED",
                String.format(
                  "Course '%s' (ID: %d) was created by %s",
                  created.getCourseName(),
                  created.getCourseId(),
                  actor
                )
            );
            // ─────────────────────────────────────────────────────────────────

            // ─── Notify all admins ───────────────────────────────────────────
            String subject = "New course: " + created.getCourseName();
            String message = String.format(
                "Course '%s' (ID: %d) was just created by %s.",
                created.getCourseName(),
                created.getCourseId(),
                actor
            );
            adminRepository.findAll().forEach(admin -> {
                Notification n = new Notification();
                n.setTo(admin.getUser().getUsername());
                n.setSubject(subject);
                n.setMessage(message);
                n.setType(NotificationType.EMAIL);
                notificationService.sendNotification(n);
            });
            // ─────────────────────────────────────────────────────────────────
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
    public ResponseEntity<?> replaceCourse(
            @Valid @RequestBody CourseDTO newCourse,
            @PathVariable Long id,
            Authentication authentication) {

        // 1) before
        EntityModel<CourseDTO> beforeModel = courseService.findById(id);
        CourseDTO before = beforeModel.getContent();

        // 2) save
        ResponseEntity<?> response = ResponseEntity.ok(courseService.save(newCourse, id));

        // 3) after
        EntityModel<CourseDTO> afterModel = courseService.findById(id);
        CourseDTO after = afterModel.getContent();

        // 4) diff
        List<String> changes = new ArrayList<>();
        if (!Objects.equals(before.getCourseName(), after.getCourseName())) {
            changes.add(String.format("name '%s' → '%s'", before.getCourseName(), after.getCourseName()));
        }
        if (!Objects.equals(before.getCourseDescription(), after.getCourseDescription())) {
            changes.add(String.format("description '%s' → '%s'", before.getCourseDescription(), after.getCourseDescription()));
        }
        if (!Objects.equals(before.getCourseDuration(), after.getCourseDuration())) {
            changes.add(String.format("duration '%s' → '%s'", before.getCourseDuration(), after.getCourseDuration()));
        }
        if (!Objects.equals(before.getCourseInstructor(), after.getCourseInstructor())) {
            changes.add(String.format("instructor '%s' → '%s'", before.getCourseInstructor(), after.getCourseInstructor()));
        }
        if (!Objects.equals(before.getCoursePrice(), after.getCoursePrice())) {
            changes.add(String.format("price '%s' → '%s'", before.getCoursePrice(), after.getCoursePrice()));
        }
        if (!Objects.equals(before.getCourseStartDate(), after.getCourseStartDate())) {
            changes.add(String.format("startDate '%s' → '%s'", before.getCourseStartDate(), after.getCourseStartDate()));
        }
        if (!Objects.equals(before.getCourseEndDate(), after.getCourseEndDate())) {
            changes.add(String.format("endDate '%s' → '%s'", before.getCourseEndDate(), after.getCourseEndDate()));
        }
        String detail = changes.isEmpty() ? "no fields changed" : String.join(", ", changes);
        String actor = authentication.getName();

        // ─── Audit ────────────────────────────────────────────────────────
        activity.logEvent(
            "COURSE_UPDATED",
            String.format("Course (ID: %d) updated by %s: %s", id, actor, detail)
        );
        // ─────────────────────────────────────────────────────────────────

       
        return response;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(
            @PathVariable Long id,
            Authentication authentication) {

        var courseOpt = courseRepository.findById(id);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Course course = courseOpt.get();
        String name = course.getCourseName();
        ResponseEntity<?> resp = courseService.deleteById(id);

        String actor = authentication.getName();

        // ─── Audit ────────────────────────────────────────────────────────
        activity.logEvent(
            "COURSE_DELETED",
            String.format("Course '%s' (ID: %d) was deleted by %s", name, id, actor)
        );
        // ─────────────────────────────────────────────────────────────────

        // ─── Notify all admins ───────────────────────────────────────────
        String subject = "Course deleted: " + name;
        String message = String.format("Course '%s' (ID: %d) was deleted by %s", name, id, actor);
        adminRepository.findAll().forEach(admin -> {
            Notification n = new Notification();
            n.setTo(admin.getUser().getUsername());
            n.setSubject(subject);
            n.setMessage(message);
            n.setType(NotificationType.EMAIL);
            notificationService.sendNotification(n);
        });
        // ─────────────────────────────────────────────────────────────────

        return resp;
    }

    // (assignInstructor omitted for brevity)
     @GetMapping("/{courseId}/enrollment-count")
public ResponseEntity<Long> getEnrollmentCount(@PathVariable Long courseId) {
    long count = studentRepository.countByEnrolledCourses_Id(courseId);
    return ResponseEntity.ok(count);
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
}
