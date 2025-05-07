package com.example.lms.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuizSubmissionRequest {
    private List<String> answers;
}