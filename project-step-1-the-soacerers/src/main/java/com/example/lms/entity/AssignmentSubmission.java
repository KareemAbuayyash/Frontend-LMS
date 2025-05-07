package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class AssignmentSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to the assignment
    @ManyToOne
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    // Link to the student
    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    // Store submission text, URL, or file reference
    @Column(columnDefinition = "TEXT")
    private String submissionContent;

    private int score;
    private boolean graded;
    private LocalDateTime submissionDate;
}
