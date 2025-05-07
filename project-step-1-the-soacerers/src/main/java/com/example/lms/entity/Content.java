package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "content")
public class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String fileType;

    private String filePath;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private Instructor uploadedBy;
}
