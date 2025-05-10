// src/main/java/com/example/lms/dto/RecentCourseDTO.java
package com.example.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecentCourseDTO {
    private Long courseId;
    private String courseName;
    private String instructorName;
    private int enrollmentCount;
}
