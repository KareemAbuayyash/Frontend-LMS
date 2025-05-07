package com.example.lms.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

@Data
public class ContentUploadDTO {
    @NotEmpty(message = "Title is required")
    private String title;

    private String description;

    private List<MultipartFile> files; 


    private String textContent;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "Instructor ID is required")
    private Long uploadedBy;
}