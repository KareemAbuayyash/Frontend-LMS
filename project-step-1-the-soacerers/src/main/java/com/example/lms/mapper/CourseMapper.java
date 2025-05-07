package com.example.lms.mapper;

import com.example.lms.entity.Course;
import com.example.lms.dto.CourseDTO;

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
}
