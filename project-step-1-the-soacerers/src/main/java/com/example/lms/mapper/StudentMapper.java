package com.example.lms.mapper;

import com.example.lms.dto.StudentDTO;
import com.example.lms.entity.Course;
import com.example.lms.entity.Student;

import java.util.stream.Collectors;

public class StudentMapper {

    public static StudentDTO toDTO(Student student) {
        if (student == null) {
            return null;
        }
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setUsername(student.getUser().getUsername());
        dto.setEmail(student.getUser().getEmail());
        dto.setPassword(student.getUser().getPassword());
        dto.setGrade(student.getGrade());
        dto.setHobbies(student.getHobbies());
        dto.setEnrolledCourseIds(
                student.getEnrolledCourses().stream()
                        .map(Course::getId)
                        .collect(Collectors.toList())
        );
        return dto;
    }
}
