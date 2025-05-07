package com.example.lms.service;

import com.example.lms.entity.Course;
import com.example.lms.entity.Student;
import com.example.lms.exception.CourseNotFoundException;
import com.example.lms.dto.CourseDTO;
import com.example.lms.mapper.CourseMapper;
import com.example.lms.repository.AdminRepository;
import com.example.lms.repository.CourseRepository;
import com.example.lms.assembler.CourseModelAssembler;

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

    private final CourseRepository courseRepository;
    private final CourseModelAssembler assembler;
    private final AdminRepository adminRepository;
    private final EmailService emailService;

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
                .orElseThrow(() -> new CourseNotFoundException(id));
        return assembler.toModel(CourseMapper.toDTO(course));
    }

    @Override
    public ResponseEntity<?> save(CourseDTO dto, Long id) {
        logger.info("Updating course with ID: {}", id);
        Course toSave = CourseMapper.toEntity(dto);
        toSave.setId(id);
        Course updated = courseRepository.save(toSave);
        logger.info("Course with ID: {} saved to DB, dispatching notifications asynchronously", id);

        // fire-and-forget
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

    /**
     * Send update notifications in a separate thread so that the API response
     * can return immediately.
     */
    @Async
    public void sendUpdateNotificationsAsync(Course updatedCourse) {
        // notify students
        if (updatedCourse.getStudents() != null) {
            for (Student student : updatedCourse.getStudents()) {
                String to = student.getUser().getEmail();
                String subject = "Course Updated: " + updatedCourse.getCourseName();
                String body = "Dear Student,\n\nThe course '"
                        + updatedCourse.getCourseName()
                        + "' has been updated. Please check it in the LMS.\n\nBest,\nLMS Team";
                try {
                    emailService.sendEmail(to, subject, body);
                    logger.info("Notified student {}", to);
                } catch (Exception e) {
                    logger.error("Failed to notify student {}", to, e);
                }
            }
        }

        // notify admins
        adminRepository.findAll().forEach(admin -> {
            String to = admin.getUser().getEmail();
            String subject = "Course Updated";
            String body = "Dear Admin,\n\nCourse '"
                    + updatedCourse.getCourseName()
                    + "' was updated. Please review.\n\nBest,\nLMS System";
            try {
                emailService.sendEmail(to, subject, body);
                logger.info("Notified admin {}", to);
            } catch (Exception e) {
                logger.error("Failed to notify admin {}", to, e);
            }
        });
    }
}
