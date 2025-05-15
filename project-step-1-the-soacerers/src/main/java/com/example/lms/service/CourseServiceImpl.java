package com.example.lms.service;

import com.example.lms.assembler.CourseModelAssembler;
import com.example.lms.dto.CourseDTO;
import com.example.lms.entity.Course;
import com.example.lms.mapper.CourseMapper;
import com.example.lms.notification.Notification;
import com.example.lms.notification.NotificationService;
import com.example.lms.notification.NotificationType;
import com.example.lms.repository.AdminRepository;
import com.example.lms.repository.ContentRepository;
import com.example.lms.repository.CourseRepository;

import jakarta.persistence.EntityNotFoundException;

import com.example.lms.audit.SystemActivityService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
    private static final Logger logger = LoggerFactory.getLogger(CourseServiceImpl.class);
    @Autowired
    private final CourseRepository       courseRepository;
    @Autowired
    private final CourseModelAssembler   assembler;
    @Autowired
    private  CourseMapper           courseMapper;
    private final SystemActivityService  activityService;
    @Autowired
    private final AdminRepository        adminRepository;
    @Autowired
    private final NotificationService    notificationService;
    @Autowired
    private final ContentRepository      contentRepository;

    @Override
    public CollectionModel<EntityModel<CourseDTO>> findAll() {
        List<EntityModel<CourseDTO>> content = courseRepository.findAll().stream()
            .map(courseMapper::toDTO)
            .map(assembler::toModel)
            .collect(Collectors.toList());
        return CollectionModel.of(content);
    }

    @Override
    public ResponseEntity<?> newCourse(CourseDTO newCourseDto) {
        // 1) map DTO → entity & save
        Course toSave = courseMapper.toEntity(newCourseDto);
        Course saved  = courseRepository.save(toSave);

        // 2) audit
        String actor = SecurityContextHolder.getContext()
                                             .getAuthentication()
                                             .getName();
        activityService.logEvent(
            "COURSE_CREATED",
            String.format(
              "Course '%s' (ID: %d) was created by %s",
              saved.getCourseName(),
              saved.getId(),
              actor
            )
        );

        // 3) notify all admins by email
        String subject = "New course: " + saved.getCourseName();
        String message = String.format(
            "Course '%s' (ID: %d) was just created by %s.",
            saved.getCourseName(),
            saved.getId(),
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

        // 4) build HATEOAS response
        EntityModel<CourseDTO> model = assembler.toModel(courseMapper.toDTO(saved));
        return ResponseEntity
                .created(model.getRequiredLink("self").toUri())
                .body(model);
    }

    @Override
    public EntityModel<CourseDTO> findById(Long id) {
        Course c = courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found: " + id));
        return assembler.toModel(courseMapper.toDTO(c));
    }

    @Override
    public ResponseEntity<?> save(CourseDTO dto, Long id) {
        logger.info("Updating course ID {}", id);

        // 1) map DTO → entity & set the existing ID
        Course toSave = courseMapper.toEntity(dto);
        toSave.setId(id);

        // 2) save
        Course updated = courseRepository.save(toSave);

        // 3) audit
        String actor = SecurityContextHolder.getContext()
                                             .getAuthentication()
                                             .getName();
        activityService.logEvent(
            "COURSE_UPDATED",
            String.format(
              "Course '%s' (ID: %d) updated by %s",
              updated.getCourseName(),
              updated.getId(),
              actor
            )
        );

        // 4) notify admins
        String subject = "Course updated: " + updated.getCourseName();
        String message = String.format(
            "Course '%s' (ID: %d) was updated by %s.",
            updated.getCourseName(),
            updated.getId(),
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

        // 5) return created-style HATEOAS response
        EntityModel<CourseDTO> model = assembler.toModel(courseMapper.toDTO(updated));
        return ResponseEntity
                .created(model.getRequiredLink("self").toUri())
                .body(model);
    }

    @Override
    @Transactional
public ResponseEntity<?> deleteById(Long id) {
  if (!courseRepository.existsById(id)) {
    return ResponseEntity.notFound().build();
  }

  courseRepository.deleteStudentCourseLinks(id);
  courseRepository.deleteCourseEnrollmentLinks(id);
  courseRepository.deleteEnrollmentCourseLinks(id);  // <— this one
  contentRepository.deleteByCourseId(id);

  courseRepository.deleteById(id);
  return ResponseEntity.noContent().build();
}
@Override
  @Transactional(readOnly = true)
  public List<CourseDTO> findByInstructorUsername(String username) {
    List<Course> courses = courseRepository.findByInstructorUsername(username);
    return courses.stream()
                  .map(courseMapper::toDTO)
                  .collect(Collectors.toList());
  }

}
