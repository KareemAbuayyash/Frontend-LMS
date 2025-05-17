package com.example.lms.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class ScoreRequest {
  @Min(value = 0, message = "Score must be ≥ 0")
  private int score;
}
