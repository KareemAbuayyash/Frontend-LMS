package com.example.lms.controller;

import com.example.lms.assembler.EnrollmentModelAssembler;
import com.example.lms.dto.EnrollmentDTO;
import com.example.lms.entity.Enrollment;
import com.example.lms.entity.Course;
import com.example.lms.entity.Student;
import com.example.lms.notification.Notification;
import com.example.lms.notification.NotificationService;
import com.example.lms.notification.NotificationType;
import com.example.lms.repository.AdminRepository;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.EnrollmentRepository;
import com.example.lms.repository.StudentRepository;
import com.example.lms.service.EnrollmentService;
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
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private static final Logger logger = LoggerFactory.getLogger(EnrollmentController.class);

    @Autowired private EnrollmentService enrollmentService;
    @Autowired private SystemActivityService activity;
    @Autowired private CourseRepository courseRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private AdminRepository adminRepository;
    @Autowired private EnrollmentModelAssembler assembler;
    @Autowired private EnrollmentRepository enrollmentRepository;
    @Autowired private NotificationService notificationService;

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
    public ResponseEntity<?> newEnrollment(
            @Valid @RequestBody EnrollmentDTO newEnrollment,
            Authentication authentication) {

        ResponseEntity<?> response = enrollmentService.newEnrollment(newEnrollment);

        if (response.getStatusCode().is2xxSuccessful()
            && response.getBody() instanceof EntityModel<?> model
            && model.getContent() instanceof EnrollmentDTO created) {

            String studentName = studentRepository.findById(created.getStudentId())
                .map(s -> s.getUser().getUsername())
                .orElse("‹unknown›");
            List<String> courseNames = courseRepository.findAllById(created.getCourseIds())
                .stream()
                .map(Course::getCourseName)
                .collect(Collectors.toList());
            String actor = authentication.getName();

            // ─── Audit ────────────────────────────────────────────────────────
            activity.logEvent(
                "ENROLLMENT_CREATED",
                String.format(
                  "Enrollment ID %d created for student '%s' in course(s) %s by %s",
                  created.getEnrollmentId(),
                  studentName,
                  courseNames,
                  actor
                )
            );
            // ─────────────────────────────────────────────────────────────────

            // ─── Notify all admins ───────────────────────────────────────────
            String subject = "New enrollment: ID " + created.getEnrollmentId();
            String message = String.format(
                "Enrollment ID %d for student '%s' in course(s) %s was created by %s",
                created.getEnrollmentId(), studentName, courseNames, actor
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
    public EntityModel<EnrollmentDTO> one(@PathVariable Long id) {
        logger.info("Request received to fetch enrollment with ID: {}", id);
        EntityModel<EnrollmentDTO> enrollment = enrollmentService.findById(id);
        logger.info("Enrollment with ID: {} fetched successfully", id);
        return enrollment;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> replaceEnrollment(
            @Valid @RequestBody EnrollmentDTO newEnrollment,
            @PathVariable Long id,
            Authentication authentication) {

        // 1) before
        EntityModel<EnrollmentDTO> beforeModel = enrollmentService.findById(id);
        EnrollmentDTO before = beforeModel.getContent();

        // 2) save
        ResponseEntity<?> response = ResponseEntity.ok(enrollmentService.save(newEnrollment, id));

        // 3) after
        EntityModel<EnrollmentDTO> afterModel = enrollmentService.findById(id);
        EnrollmentDTO after = afterModel.getContent();

        List<String> beforeCourses = courseRepository.findAllById(before.getCourseIds())
            .stream().map(Course::getCourseName).collect(Collectors.toList());
        List<String> afterCourses = courseRepository.findAllById(after.getCourseIds())
            .stream().map(Course::getCourseName).collect(Collectors.toList());
        String beforeStudent = studentRepository.findById(before.getStudentId())
            .map(s -> s.getUser().getUsername()).orElse("‹unknown›");
        String afterStudent = studentRepository.findById(after.getStudentId())
            .map(s -> s.getUser().getUsername()).orElse("‹unknown›");

        List<String> changes = new ArrayList<>();
        if (!beforeStudent.equals(afterStudent)) {
            changes.add(String.format("student '%s' → '%s'", beforeStudent, afterStudent));
        }
        if (!Objects.equals(beforeCourses, afterCourses)) {
            changes.add(String.format("courses %s → %s", beforeCourses, afterCourses));
        }
        if (before.isCompleted() != after.isCompleted()) {
            changes.add(String.format("completed %b → %b", before.isCompleted(), after.isCompleted()));
        }
        if (!Objects.equals(before.getEnrollmentDate(), after.getEnrollmentDate())) {
            changes.add(String.format(
              "enrollmentDate '%s' → '%s'",
              before.getEnrollmentDate(),
              after.getEnrollmentDate()
            ));
        }
        String detail = changes.isEmpty() ? "no fields changed" : String.join(", ", changes);
        String actor = authentication.getName();

        // ─── Audit ────────────────────────────────────────────────────────
        activity.logEvent(
            "ENROLLMENT_UPDATED",
            String.format("Enrollment (ID: %d) updated by %s: %s", id, actor, detail)
        );
        // ─────────────────────────────────────────────────────────────────

        // ─── Notify all admins ───────────────────────────────────────────
        String subject = "Enrollment updated: ID " + id;
        String message = String.format(
            "Enrollment ID %d was updated by %s: %s", id, actor, detail
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

        return response;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEnrollment(
            @PathVariable Long id,
            Authentication authentication) {

        Enrollment enrollment = enrollmentRepository.findByIdWithCourses(id);
        if (enrollment == null) {
            return ResponseEntity.notFound().build();
        }

        String studentName = Optional.ofNullable(enrollment.getStudent())
            .map(s -> s.getUser().getUsername())
            .orElse("‹unknown›");
        List<String> courseNames = enrollment.getCourses()
            .stream()
            .map(Course::getCourseName)
            .collect(Collectors.toList());

        ResponseEntity<?> resp = enrollmentService.deleteById(id);
        String actor = authentication.getName();

        // ─── Audit ────────────────────────────────────────────────────────
        activity.logEvent(
            "ENROLLMENT_DELETED",
            String.format(
              "Enrollment ID %d for student '%s' in course(s) %s was deleted by %s",
              id, studentName, courseNames, actor
            )
        );
        // ─────────────────────────────────────────────────────────────────

        // ─── Notify all admins ───────────────────────────────────────────
        String subject = "Enrollment deleted: ID " + id;
        String message = String.format(
            "Enrollment ID %d for student '%s' in course(s) %s was deleted by %s",
            id, studentName, courseNames, actor
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

        return resp;
    }
}
