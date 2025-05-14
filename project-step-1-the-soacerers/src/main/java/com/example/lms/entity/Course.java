package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@Table(name = "course")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String courseName;
    private String courseDescription;
    private String courseDuration;
    private String courseInstructor;
    private String courseLevel;
    private Double coursePrice;
    private Date courseStartDate;
    private Date courseEndDate;
    private boolean completed;

    @ManyToMany(mappedBy = "enrolledCourses", fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Student> students;

    @ManyToMany
    @JoinTable(name = "course_enrollment", joinColumns = @JoinColumn(name = "course_id"), inverseJoinColumns = @JoinColumn(name = "enrollment_id"))
    private List<Enrollment> enrollments;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private Instructor instructor;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Content> contents;
    
}
