package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Question> questions = new ArrayList<>();

    public void addQuestion(Question question) {
        question.setQuiz(this);
        this.questions.add(question);
    }

    // ← NEW FIELDS:
    @Column(nullable = false)
    private int pageSize = 1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NavigationMode navigationMode = NavigationMode.FREE;

    public enum NavigationMode { FREE, LINEAR }
}
