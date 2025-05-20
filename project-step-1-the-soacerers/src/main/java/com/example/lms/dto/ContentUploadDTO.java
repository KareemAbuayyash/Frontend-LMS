package com.example.lms.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ContentUploadDTO {
    @NotEmpty(message="Title required")
    private String title;

    private String description;

    private List<MultipartFile> files;

    @NotNull(message="Course ID required")
    private Long courseId;

    @NotNull(message="Instructor ID required")
    private Long uploadedBy;
}
