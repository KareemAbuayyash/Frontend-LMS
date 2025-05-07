package com.example.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
  private String accessToken;
  private String refreshToken;
  private String errorMessage;

  public AuthResponse(String accessToken, String refreshToken) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
  }

  public AuthResponse(String errorMessage) {
      this.errorMessage = errorMessage;
  }

}
