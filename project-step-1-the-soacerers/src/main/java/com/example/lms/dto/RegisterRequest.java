package com.example.lms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;


@Data
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Username is required")
    private String username;
    @NotBlank
    private String name;  
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "ADMIN|INSTRUCTOR|STUDENT", message = "Invalid role")
    private String role;

    private String profile;

    @NotBlank(message = "Password is required")
    private String password;
}
