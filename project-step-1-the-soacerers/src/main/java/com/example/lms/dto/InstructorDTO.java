package com.example.lms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class InstructorDTO {
    @Null(message = "id must be null when creating a new instructor")
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid address")
    private String email;

    @NotBlank(message = "Graduate degree is required")
    private String graduateDegree;

    @NotBlank(message = "Expertise is required")
    private String expertise;

    @NotEmpty(message = "assignedCourseIds must contain at least one course ID")
    private List<
        @NotNull(message = "courseId cannot be null")
        @Positive(message = "courseId must be positive")
        Long> assignedCourseIds;
}
