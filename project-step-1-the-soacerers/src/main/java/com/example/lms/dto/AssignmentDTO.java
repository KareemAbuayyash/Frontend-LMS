package com.example.lms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AssignmentDTO {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Due date is required")
    @Future(message = "Due date must be in the future")
    private LocalDateTime dueDate;

    @Min(value = 1, message = "Total points must be ≥ 1")
    private int totalPoints;

    private int score;
    private boolean graded;

    // ↪️ removed @NotNull here (we always set it server-side)
    private Long courseId;

    /**
     * If instructor uploaded one, this will be "/files/…"
     */
    private String attachmentUrl;
}
