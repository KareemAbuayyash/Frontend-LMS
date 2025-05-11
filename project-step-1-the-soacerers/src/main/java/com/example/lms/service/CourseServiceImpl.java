package com.example.lms.service;

import com.example.lms.assembler.CourseModelAssembler;
import com.example.lms.dto.CourseDTO;
import com.example.lms.entity.Course;
import com.example.lms.entity.Student;
import com.example.lms.mapper.CourseMapper;
import com.example.lms.notification.Notification;
import com.example.lms.notification.NotificationService;
import com.example.lms.notification.NotificationType;
import com.example.lms.repository.AdminRepository;
import com.example.lms.repository.CourseRepository;
import com.example.lms.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private static final Logger logger = LoggerFactory.getLogger(CourseServiceImpl.class);

    private final CourseRepository          courseRepository;
    private final CourseModelAssembler      assembler;
    private final AdminRepository           adminRepository;
    private final NotificationService       notificationService;   // ← inject NotificationService

    @Override
    public CollectionModel<EntityModel<CourseDTO>> findAll() {
        logger.info("Fetching all courses");
        List<EntityModel<CourseDTO>> courses = courseRepository.findAll().stream()
            .map(CourseMapper::toDTO)
            .map(assembler::toModel)
            .collect(Collectors.toList());
        return CollectionModel.of(courses);
    }

    @Override
    public ResponseEntity<?> newCourse(CourseDTO newCourse) {
        Course course = courseRepository.save(CourseMapper.toEntity(newCourse));
        EntityModel<CourseDTO> model = assembler.toModel(CourseMapper.toDTO(course));
        return ResponseEntity.created(model.getRequiredLink("self").toUri()).body(model);
    }

    @Override
    public EntityModel<CourseDTO> findById(Long id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found: " + id));
        return assembler.toModel(CourseMapper.toDTO(course));
    }

    @Override
    public ResponseEntity<?> save(CourseDTO dto, Long id) {
        logger.info("Updating course with ID: {}", id);
        Course toSave = CourseMapper.toEntity(dto);
        toSave.setId(id);
        Course updated = courseRepository.save(toSave);
        logger.info("Course with ID: {} saved to DB, dispatching notifications asynchronously", id);

        sendUpdateNotificationsAsync(updated);

        EntityModel<CourseDTO> model = assembler.toModel(CourseMapper.toDTO(updated));
        return ResponseEntity.created(model.getRequiredLink("self").toUri()).body(model);
    }

    @Override
    public ResponseEntity<?> deleteById(Long id) {
        if (!courseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        courseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    @Async
    public void sendUpdateNotificationsAsync(Course updatedCourse) {
        // notify students
        if (updatedCourse.getStudents() != null) {
            for (Student student : updatedCourse.getStudents()) {
                String username = student.getUser().getUsername();  // ← use username
                Notification n = new Notification();
                n.setTo(username);
                n.setSubject("Course Updated: " + updatedCourse.getCourseName());
                n.setMessage(
                    "Dear Student,\n\n" +
                    "The course '" + updatedCourse.getCourseName() + "' has been updated. " +
                    "Please check it in the LMS.\n\nBest,\nLMS Team"
                );
                n.setType(NotificationType.EMAIL);
                notificationService.sendNotification(n);
                logger.info("Notification (student) sent to: {}", username);
            }
        }

        // notify admins
        adminRepository.findAll().forEach(admin -> {
            String username = admin.getUser().getUsername();      // ← use username
            Notification n = new Notification();
            n.setTo(username);
            n.setSubject("Course Updated: " + updatedCourse.getCourseName());
            n.setMessage(
                "Dear Admin,\n\n" +
                "Course '" + updatedCourse.getCourseName() + "' was updated. Please review.\n\n" +
                "Best,\nLMS System"
            );
            n.setType(NotificationType.EMAIL);
            notificationService.sendNotification(n);
            logger.info("Notification (admin) sent to: {}", username);
        });
    }
}
