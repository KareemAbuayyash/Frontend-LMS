// src/main/java/com/example/lms/dto/DashboardStatsDTO.java
package com.example.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalUsers;
    private long totalCourses;
    private long totalEnrollments;
}
