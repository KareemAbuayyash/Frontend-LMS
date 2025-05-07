package com.example.lms.mapper;

import com.example.lms.entity.Enrollment;
import com.example.lms.dto.EnrollmentDTO;
import com.example.lms.entity.Course;

import java.util.stream.Collectors;

public class EnrollmentMapper {

    public static Enrollment toEntity(EnrollmentDTO enrollmentDTO) {
        Enrollment enrollment = new Enrollment();
        enrollment.setEnrollmentId(enrollmentDTO.getEnrollmentId());
        enrollment.setCompleted(enrollmentDTO.isCompleted());
        enrollment.setEnrollmentDate(enrollmentDTO.getEnrollmentDate());
        return enrollment;
    }

    public static EnrollmentDTO toDTO(Enrollment enrollment) {
        EnrollmentDTO enrollmentDTO = new EnrollmentDTO();
        enrollmentDTO.setEnrollmentId(enrollment.getEnrollmentId());
        enrollmentDTO.setStudentId(enrollment.getStudent().getId());
        enrollmentDTO.setCourseIds(enrollment.getCourses().stream()
            .map(Course::getId)
            .collect(Collectors.toList()));
        enrollmentDTO.setCompleted(enrollment.isCompleted());
        enrollmentDTO.setEnrollmentDate(enrollment.getEnrollmentDate());
        return enrollmentDTO;
    }
}
