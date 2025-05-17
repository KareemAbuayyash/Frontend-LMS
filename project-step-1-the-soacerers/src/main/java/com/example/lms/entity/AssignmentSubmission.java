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

  @ManyToOne @JoinColumn(name = "assignment_id")
  private Assignment assignment;

  @ManyToOne @JoinColumn(name = "student_id")
  private Student student;

  @Column(length = 5000)
  private String submissionContent;

  private LocalDateTime submissionDate;
  private int score;
  private boolean graded;

  /**
   * URL under "/files/…" that student attached
   */
  private String fileUrl;
}
