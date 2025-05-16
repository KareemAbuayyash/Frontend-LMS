package com.example.lms.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class QuizDTO {
    @Null(message = "id must be null for a new quiz")
    private Long id;

    @NotBlank(message = "Quiz title must not be blank")
    private String title;

    @NotEmpty(message = "A quiz must contain at least one question")
    private List<@Valid QuestionDTO> questions;

    // ← NEW FIELDS
    @Min(value = 1, message = "pageSize must be at least 1")
    private Integer pageSize;

    @NotNull(message = "navigationMode must be provided")
    private NavigationMode navigationMode;

    public enum NavigationMode {
      FREE,      // can always go back & forth
      LINEAR     // only move forward, no revisit
    }
}
