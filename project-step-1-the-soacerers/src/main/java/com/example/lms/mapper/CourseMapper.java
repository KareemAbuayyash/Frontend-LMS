package com.example.lms.mapper;

import com.example.lms.dto.CourseDTO;
import com.example.lms.dto.CourseSummaryDTO;
import com.example.lms.entity.Course;
import com.example.lms.entity.Instructor;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CourseMapper {

    private final InstructorRepository instructorRepo;

    @Autowired
    public CourseMapper(InstructorRepository instructorRepo) {
        this.instructorRepo = instructorRepo;
    }

    public Course toEntity(CourseDTO dto) {
        Course c = new Course();
        c.setCourseName(dto.getCourseName());
        c.setCourseDescription(dto.getCourseDescription());
        c.setCourseDuration(dto.getCourseDuration());
        c.setCoursePrice(dto.getCoursePrice());
        c.setCourseStartDate(dto.getCourseStartDate());
        c.setCourseEndDate(dto.getCourseEndDate());

        Instructor inst = instructorRepo.findById(dto.getInstructorId())
            .orElseThrow(() ->
                new ResourceNotFoundException("Instructor not found: " + dto.getInstructorId())
            );
        c.setInstructor(inst);

        return c;
    }

    public CourseDTO toDTO(Course c) {
        CourseDTO dto = new CourseDTO();
        dto.setCourseId(c.getId());
        dto.setCourseName(c.getCourseName());
        dto.setCourseDescription(c.getCourseDescription());
        dto.setCourseDuration(c.getCourseDuration());
        dto.setCoursePrice(c.getCoursePrice());
        dto.setCourseStartDate(c.getCourseStartDate());
        dto.setCourseEndDate(c.getCourseEndDate());
        dto.setInstructorId(c.getInstructor() != null ? c.getInstructor().getId() : null);
        return dto;
    }
    public static CourseSummaryDTO toCourseSummaryDTO(Course course, boolean completed) {
        CourseSummaryDTO dto = new CourseSummaryDTO();
        dto.setCourseId(course.getId());
        dto.setCourseName(course.getCourseName());
        Instructor instructor = course.getInstructor();
        dto.setInstructorName(instructor != null ? instructor.getUser().getUsername() : "N/A");
        dto.setDuration("12 weeks"); // Customize as needed
        dto.setCompleted(completed);
        dto.setCourseDescription(course.getCourseDescription());
        return dto;
    }
}
