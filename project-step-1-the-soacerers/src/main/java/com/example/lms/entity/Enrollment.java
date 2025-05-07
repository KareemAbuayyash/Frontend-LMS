package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Entity
@Data
@Table(name = "enrollment")
public class Enrollment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long enrollmentId;
  private boolean completed;
  private Date enrollmentDate;

  @ManyToOne
  @JoinColumn(name = "student_id")
  private Student student;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(name = "enrollment_courses", joinColumns = @JoinColumn(name = "enrollment_id"), inverseJoinColumns = @JoinColumn(name = "course_id"))
  private List<Course> courses;

}
