package com.example.lms.dto;

import lombok.Data;

@Data
public class CourseSummaryDTO {
    private Long courseId;
    private String courseName;
    private String instructorName;
    private String duration;
    private boolean completed;
    private String courseDescription;
}
