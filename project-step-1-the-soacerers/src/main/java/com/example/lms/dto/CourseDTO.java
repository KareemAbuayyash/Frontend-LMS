package com.example.lms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class CourseDTO {

    private Long courseId;

    @NotBlank(message = "Course name must not be blank")
    private String courseName;

    @NotBlank(message = "Course description must not be blank")
    private String courseDescription;

    private String courseDuration;
    @JsonProperty("courseInstructor")
    @NotNull(message = "Instructor ID is required")
    private Long instructorId;
    @PositiveOrZero(message = "Price can't be negative")
    private Double coursePrice;

    private Date courseStartDate;
    private Date courseEndDate;
}
