package com.example.lms.dto;

import com.example.lms.entity.QuestionType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class QuestionDTO {
    @Null(message = "id must be null for a new question")
    private Long id;

    @NotBlank(message = "Question text must not be blank")
    private String text;

    @NotBlank(message = "Correct answer must not be blank")
    private String correctAnswer;

    @NotNull(message = "Question type is required")
    private QuestionType questionType;

    @NotNull(message = "Options list must not be null")
     private List<@NotBlank(message = "Option must not be blank") String> options = new ArrayList<>();

    @NotNull(message = "Weight is required")
    @Min(value = 1, message = "Weight must be at least 1")
    private Integer weight;
}
