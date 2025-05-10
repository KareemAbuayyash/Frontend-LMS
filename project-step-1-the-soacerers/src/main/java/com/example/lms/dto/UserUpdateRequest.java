package com.example.lms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data
public class UserUpdateRequest {
    @NotBlank private String username;
    @NotBlank @Email private String email;
    @Pattern(regexp="ADMIN|INSTRUCTOR|STUDENT") private String role;
    private String profile;
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;  // optional
  }
  