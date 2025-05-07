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
}
