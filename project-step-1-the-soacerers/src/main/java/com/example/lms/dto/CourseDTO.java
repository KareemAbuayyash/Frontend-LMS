package com.example.lms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.util.Date;

@Data
public class CourseDTO {

    private Long courseId;

    @NotBlank(message = "Course name must not be blank")
    private String courseName;

    @NotBlank(message = "Course description must not be blank")
    private String courseDescription;

    private String courseDuration;         
    private String courseInstructor;

    @PositiveOrZero(message = "Price can't be negative")
    private Double coursePrice;

    private Date courseStartDate;
    private Date courseEndDate;
}
