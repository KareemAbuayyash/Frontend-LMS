package com.example.lms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserDTO {

  
    @Null(message = "userId must be null when creating a new user")
    private Long userId;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Role is required")
    @Pattern(
      regexp = "ADMIN|INSTRUCTOR|STUDENT",
      message = "Role must be one of: ADMIN, INSTRUCTOR, STUDENT"
    )
    private String role;

    private String profile;
}
