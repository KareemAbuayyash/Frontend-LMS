package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "instructor")
public class Instructor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String expertise;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    private String graduateDegree;
    
    @OneToMany(mappedBy = "instructor", fetch = FetchType.EAGER)
    private List<Course> courses;

    @OneToMany(mappedBy = "uploadedBy", cascade = CascadeType.ALL)
    private List<Content> uploadedContents;
}
