package com.example.lms.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    private Long quizId;

    private int score;

    @ElementCollection(fetch = FetchType.EAGER)
    @Column(nullable = false)
    private List<String> answers;

    @Column(nullable = false)
    private LocalDateTime submissionDate;

    // Make sure the columnDefinition sets a default of 0 in MySQL
    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean graded;

    @ManyToOne
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

}
