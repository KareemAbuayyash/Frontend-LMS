package com.example.lms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SubmissionResponse {

    @NotNull(message = "Submission ID must not be null")
    private Long id;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    private String studentName;

    @NotNull(message = "Quiz ID is required")
    private Long quizId;

    @Min(value = 0, message = "Score must be zero or positive")
    private int score;

    @NotEmpty(message = "Answers list must not be empty")
    private List<@NotBlank(message = "Answer must not be blank") String> answers;

    @NotNull(message = "Submission date is required")
    private LocalDateTime submissionDate;
}
