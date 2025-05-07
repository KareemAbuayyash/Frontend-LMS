package com.example.lms.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;

@Data
public class EnrollmentDTO {
  @Null(message = "enrollmentId must be null when creating a new enrollment")
  private Long enrollmentId;

  @NotNull(message = "studentId is required")
  private Long studentId;

  @NotEmpty(message = "At least one courseId must be provided")
  private List<
    @NotNull(message = "courseId cannot be null")
    @Positive(message = "courseId must be positive")
    Long
  > courseIds;

  private boolean completed;

  @NotNull(message = "enrollmentDate is required")
  @PastOrPresent(message = "enrollmentDate cannot be in the future")
  private Date enrollmentDate;
}