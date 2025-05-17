package com.example.lms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SubmissionDTO {
  private Long id;

  @NotNull private Long assignmentId;
  @NotNull private Long studentId;
  @NotBlank private String submissionContent;
  @NotNull private LocalDateTime submissionDate;

  private int score;
  private boolean graded;

  /** populated by mapper */
  private String studentName;
  private String fileUrl;
}
