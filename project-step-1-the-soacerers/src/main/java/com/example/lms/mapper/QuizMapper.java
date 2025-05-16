package com.example.lms.mapper;

import com.example.lms.dto.QuestionDTO;
import com.example.lms.dto.QuizDTO;
import com.example.lms.entity.Question;
import com.example.lms.entity.Quiz;

import java.util.List;
import java.util.stream.Collectors;

public class QuizMapper {

    public static QuizDTO toDTO(Quiz quiz) {
        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());

        List<QuestionDTO> questionDTOs = quiz.getQuestions().stream()
            .map(question -> {
                QuestionDTO qdto = new QuestionDTO();
                qdto.setId(question.getId());
                qdto.setText(question.getText());
                qdto.setCorrectAnswer(question.getCorrectAnswer());
                qdto.setQuestionType(question.getQuestionType());
                qdto.setOptions(question.getOptions());
                qdto.setWeight(question.getWeight());
                return qdto;
            })
            .collect(Collectors.toList());

        dto.setQuestions(questionDTOs);
        return dto;
    }

    public static Quiz toEntity(QuizDTO dto) {
        Quiz quiz = new Quiz();
        quiz.setTitle(dto.getTitle());

        List<Question> questions = dto.getQuestions().stream()
            .map(qdto -> {
                Question question = new Question();
                question.setText(qdto.getText());
                question.setCorrectAnswer(qdto.getCorrectAnswer());
                question.setQuestionType(qdto.getQuestionType());
                question.setOptions(qdto.getOptions());
                question.setWeight(qdto.getWeight());
                question.setQuiz(quiz);
                return question;
            })
            .collect(Collectors.toList());

        quiz.setQuestions(questions);
        return quiz;
    }

    public static void updateEntity(QuizDTO quizDTO, Quiz quiz) {
        quiz.setTitle(quizDTO.getTitle());

        List<Question> questions = quizDTO.getQuestions().stream()
            .map(qdto -> {
                Question question = new Question();
                question.setText(qdto.getText());
                question.setCorrectAnswer(qdto.getCorrectAnswer());
                question.setQuestionType(qdto.getQuestionType());
                question.setOptions(qdto.getOptions());
                question.setWeight(qdto.getWeight());
                question.setQuiz(quiz);
                return question;
            })
            .collect(Collectors.toList());

        quiz.setQuestions(questions);
    }
}
