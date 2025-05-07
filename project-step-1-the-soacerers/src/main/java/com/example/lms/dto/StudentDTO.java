package com.example.lms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class StudentDTO {
    @Null(message = "id must be null for a new student")
    private Long id;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    
    private String grade;
    private String hobbies;

    @NotNull(message = "enrolledCourseIds must not be null")
    private List<@NotNull(message = "Course ID in list must not be null") Long> enrolledCourseIds;
}
