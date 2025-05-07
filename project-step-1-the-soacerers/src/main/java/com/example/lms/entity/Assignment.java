package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private int score;
    private boolean graded;

    private int totalPoints;
    private LocalDateTime dueDate;

    // Attach the assignment to a course
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
}
