package com.example.lms.mapper;

import com.example.lms.dto.QuestionDTO;
import com.example.lms.entity.Question;
import com.example.lms.entity.Quiz;

public class QuestionMapper {

    private QuestionMapper() {
    }

    
    public static Question toEntity(QuestionDTO dto, Quiz quiz) {
        if (dto == null) {
            return null;
        }

        Question question = new Question();
        question.setText(dto.getText());
        question.setCorrectAnswer(dto.getCorrectAnswer());
        question.setQuestionType(dto.getQuestionType());
        question.setOptions(dto.getOptions());
        question.setQuiz(quiz); 

        return question;
    }
}
