package com.example.lms.mapper;

import com.example.lms.dto.InstructorDTO;
import com.example.lms.entity.Instructor;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class InstructorMapper {

    public InstructorDTO toDTO(Instructor instructor) {
        if (instructor == null) {
            return null;
        }
        InstructorDTO dto = new InstructorDTO();
        dto.setId(instructor.getId());
        if (instructor.getUser() != null) {
            dto.setName(instructor.getUser().getUsername());
            dto.setEmail(instructor.getUser().getEmail());
        }
        dto.setGraduateDegree(instructor.getGraduateDegree());
        dto.setExpertise(instructor.getExpertise());
        List<Long> courseIds = instructor.getCourses().stream()
                .map(course -> course.getId())
                .collect(Collectors.toList());
        dto.setAssignedCourseIds(courseIds);
        return dto;
    }
}
