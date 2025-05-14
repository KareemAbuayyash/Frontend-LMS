package com.example.lms.mapper;

import com.example.lms.entity.Course;
import com.example.lms.entity.Instructor;
import com.example.lms.dto.CourseDTO;
import com.example.lms.dto.CourseSummaryDTO;

public class CourseMapper {

    public static Course toEntity(CourseDTO courseDTO) {
        Course course = new Course();
        course.setCourseName(courseDTO.getCourseName());
        course.setCourseDescription(courseDTO.getCourseDescription());
        course.setCourseDuration(courseDTO.getCourseDuration());
        course.setCourseInstructor(courseDTO.getCourseInstructor());
        course.setCoursePrice(courseDTO.getCoursePrice());
        course.setCourseStartDate(courseDTO.getCourseStartDate());
        course.setCourseEndDate(courseDTO.getCourseEndDate());
        return course;
    }

    public static CourseDTO toDTO(Course course) {
        CourseDTO courseDTO = new CourseDTO();
        courseDTO.setCourseId(course.getId());
        courseDTO.setCourseName(course.getCourseName());
        courseDTO.setCourseDescription(course.getCourseDescription());
        courseDTO.setCourseDuration(course.getCourseDuration());
        courseDTO.setCourseInstructor(course.getCourseInstructor());
        courseDTO.setCoursePrice(course.getCoursePrice());
        courseDTO.setCourseStartDate(course.getCourseStartDate());
        courseDTO.setCourseEndDate(course.getCourseEndDate());
        return courseDTO;
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
