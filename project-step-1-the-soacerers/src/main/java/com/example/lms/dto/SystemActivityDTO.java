// src/main/java/com/example/lms/dto/SystemActivityDTO.java
package com.example.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.Instant;

@Data
@AllArgsConstructor
public class SystemActivityDTO {
    private Instant timestamp;
    private String type;
    private String message;
}
