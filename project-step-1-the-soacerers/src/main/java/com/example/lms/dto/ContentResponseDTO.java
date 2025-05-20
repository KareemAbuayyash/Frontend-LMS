package com.example.lms.dto;

import lombok.Data;

@Data
public class ContentResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String filePath;
    private String fileType;
    private Long courseId;
    private Long instructorId;
}
