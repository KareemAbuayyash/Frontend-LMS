package com.example.lms.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
@ToString(exclude = "quiz")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    private String correctAnswer;

    @Enumerated(EnumType.STRING)
    private QuestionType questionType;  

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    @JsonBackReference 
    private Quiz quiz;

    @ElementCollection(fetch = FetchType.EAGER) 
    private List<String> options = new ArrayList<>();
}
