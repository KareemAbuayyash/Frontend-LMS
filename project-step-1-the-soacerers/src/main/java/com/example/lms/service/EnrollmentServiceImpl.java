package com.example.lms.service;

import com.example.lms.entity.Enrollment;
import com.example.lms.entity.Student;
import com.example.lms.entity.Course;
import com.example.lms.exception.CourseNotFoundException;
import com.example.lms.exception.DuplicateAssociationException;
import com.example.lms.exception.UserNotFoundException;
import com.example.lms.dto.EnrollmentDTO;
import com.example.lms.mapper.EnrollmentMapper;
import com.example.lms.repository.EnrollmentRepository;
import com.example.lms.repository.StudentRepository;
import com.example.lms.repository.CourseRepository;
import com.example.lms.assembler.EnrollmentModelAssembler;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private static final Logger logger = LoggerFactory.getLogger(EnrollmentServiceImpl.class);

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentModelAssembler assembler;

    @Override
    public CollectionModel<EntityModel<EnrollmentDTO>> findAll() {
        logger.info("Fetching all enrollments");
        List<EntityModel<EnrollmentDTO>> enrollments = enrollmentRepository.findAll().stream()
                .map(EnrollmentMapper::toDTO)
                .map(assembler::toModel)
                .collect(Collectors.toList());
        logger.info("Fetched {} enrollments", enrollments.size());
        return CollectionModel.of(enrollments);
    }

    @Override
    public ResponseEntity<?> newEnrollment(EnrollmentDTO newEnrollment) {
        logger.info("Creating a new enrollment for student ID: {}", newEnrollment.getStudentId());
        Enrollment enrollment = EnrollmentMapper.toEntity(newEnrollment);

        Student student = studentRepository.findById(newEnrollment.getStudentId())
                .orElseThrow(() -> {
                    logger.error("Student with ID: {} not found", newEnrollment.getStudentId());
                    return new UserNotFoundException(newEnrollment.getStudentId());
                });

        List<Course> courses = newEnrollment.getCourseIds().stream()
                .map(courseId -> courseRepository.findById(courseId)
                        .orElseThrow(() -> {
                            logger.error("Course with ID: {} not found", courseId);
                            return new CourseNotFoundException(courseId);
                        }))
                .collect(Collectors.toList());
        List<Long> duplicate = courses.stream()
                .map(Course::getId)
                .filter(courseId -> student.getEnrolledCourses()
                        .stream()
                        .anyMatch(c -> c.getId().equals(courseId)))
                .toList();

        if (!duplicate.isEmpty()) {
            throw new DuplicateAssociationException(
                    "Student with ID " + student.getId() +
                            " is already enrolled in course(s): " + duplicate);
        }
        enrollment.setStudent(student);
        enrollment.setCourses(courses);

        student.getEnrolledCourses().addAll(courses);
        studentRepository.save(student);

        enrollment = enrollmentRepository.save(enrollment);

        logger.info("Enrollment created successfully with ID: {}", enrollment.getEnrollmentId());
        EntityModel<EnrollmentDTO> entityModel = assembler.toModel(EnrollmentMapper.toDTO(enrollment));
        return ResponseEntity.created(entityModel.getRequiredLink("self").toUri()).body(entityModel);
    }

    @Override
    public EntityModel<EnrollmentDTO> findById(Long id) {
        logger.info("Fetching enrollment with ID: {}", id);
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Enrollment with ID: {} not found", id);
                    return new CourseNotFoundException(id);
                });
        logger.info("Enrollment with ID: {} fetched successfully", id);
        return assembler.toModel(EnrollmentMapper.toDTO(enrollment));
    }

    @Override
    public ResponseEntity<?> save(EnrollmentDTO newEnrollment, Long id) {
        logger.info("Updating enrollment with ID: {}", id);
        Enrollment enrollment = EnrollmentMapper.toEntity(newEnrollment);
        enrollment.setEnrollmentId(id);

        Student student = studentRepository.findById(newEnrollment.getStudentId())
                .orElseThrow(() -> {
                    logger.error("Student with ID: {} not found", newEnrollment.getStudentId());
                    return new UserNotFoundException(newEnrollment.getStudentId());
                });

        List<Course> courses = newEnrollment.getCourseIds().stream()
                .map(courseId -> courseRepository.findById(courseId)
                        .orElseThrow(() -> {
                            logger.error("Course with ID: {} not found", courseId);
                            return new CourseNotFoundException(courseId);
                        }))
                .collect(Collectors.toList());

        enrollment.setStudent(student);
        enrollment.setCourses(courses);

        Enrollment updatedEnrollment = enrollmentRepository.save(enrollment);
        logger.info("Enrollment with ID: {} updated successfully", id);

        EntityModel<EnrollmentDTO> entityModel = assembler.toModel(EnrollmentMapper.toDTO(updatedEnrollment));
        return ResponseEntity.created(entityModel.getRequiredLink("self").toUri()).body(entityModel);
    }

    @Override
  @Transactional
  public ResponseEntity<?> deleteById(Long id) {
    return enrollmentRepository.findById(id)
      .map(enrollment -> {
        // 1) remove the courses from the student's enrolledCourses
        Student student = enrollment.getStudent();
        student.getEnrolledCourses().removeAll(enrollment.getCourses());
        studentRepository.save(student);

        // 2) delete the enrollment itself
        enrollmentRepository.delete(enrollment);
        return ResponseEntity.noContent().build();
      })
      .orElseGet(() -> ResponseEntity.notFound().build());
  }
}
