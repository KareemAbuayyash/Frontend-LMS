package com.example.lms.dto;

import java.time.LocalDateTime;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AssignmentDTO {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @Min(value = 0, message = "Score must be zero or positive")
    private int score;

    private boolean graded;

    @Min(value = 1, message = "Total points must be at least 1")
    private int totalPoints;

    @NotNull(message = "Due date is required")
    @Future(message = "Due date must be in the future")
    private LocalDateTime dueDate;

    @NotNull(message = "Course ID is required")
    private Long courseId;
}
