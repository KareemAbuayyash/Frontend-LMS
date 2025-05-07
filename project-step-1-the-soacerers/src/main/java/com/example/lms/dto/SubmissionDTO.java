package com.example.lms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SubmissionDTO {

    @NotNull(message = "Submission ID must not be null")
    private Long id;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Assignment ID is required")
    private Long assignmentId;

    @NotBlank(message = "Submission content must not be blank")
    private String submissionContent;

    @Min(value = 0, message = "Score must be zero or positive")
    private int score;

    private boolean graded;

    @NotNull(message = "Submission date is required")
    @PastOrPresent(message = "Submission date cannot be in the future")
    private LocalDateTime submissionDate;
}
