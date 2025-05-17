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

  @Column(length = 2000)
  private String description;

  private LocalDateTime dueDate;
  private int totalPoints;

  private int score;
  private boolean graded;

  /**
   * If instructor uploaded an attachment, this is "/files/XXX.pdf"
   */
  private String attachmentUrl;

  @ManyToOne
  @JoinColumn(name = "course_id")
  private Course course;
}
