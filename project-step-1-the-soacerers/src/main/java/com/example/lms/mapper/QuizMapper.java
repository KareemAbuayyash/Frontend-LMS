package com.example.lms.mapper;

import com.example.lms.dto.QuizDTO;
import com.example.lms.dto.QuestionDTO;
import com.example.lms.entity.Quiz;
import com.example.lms.entity.Question;

import java.util.List;
import java.util.stream.Collectors;

public class QuizMapper {

    public static QuizDTO toDTO(Quiz quiz) {
        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());

        // map questions
        List<QuestionDTO> questionDTOs = quiz.getQuestions().stream()
            .map(q -> {
                QuestionDTO d = new QuestionDTO();
                d.setId(q.getId());
                d.setText(q.getText());
                d.setQuestionType(q.getQuestionType());
                d.setOptions(q.getOptions());
                d.setCorrectAnswer(q.getCorrectAnswer());
                d.setWeight(q.getWeight());
                return d;
            })
            .collect(Collectors.toList());
        dto.setQuestions(questionDTOs);

        // Safe-guard navigationMode:
    Quiz.NavigationMode entNav = quiz.getNavigationMode();
    dto.setPageSize( quiz.getPageSize() );
    dto.setNavigationMode(
      entNav == null
        ? QuizDTO.NavigationMode.FREE
        : QuizDTO.NavigationMode.valueOf(entNav.name())
    );
        return dto;
    }

    public static Quiz toEntity(QuizDTO dto) {
        Quiz quiz = new Quiz();
        quiz.setTitle(dto.getTitle());

        // ← set new fields
        quiz.setPageSize(dto.getPageSize());
        quiz.setNavigationMode(
          Quiz.NavigationMode.valueOf(dto.getNavigationMode().name())
        );

        List<Question> questions = dto.getQuestions().stream()
            .map(qdto -> {
                Question q = new Question();
                q.setText(qdto.getText());
                q.setQuestionType(qdto.getQuestionType());
                q.setOptions(qdto.getOptions());
                q.setCorrectAnswer(qdto.getCorrectAnswer());
                q.setWeight(qdto.getWeight());
                q.setQuiz(quiz);
                return q;
            })
            .collect(Collectors.toList());
        quiz.setQuestions(questions);
        return quiz;
    }

    public static void updateEntity(QuizDTO dto, Quiz quiz) {
        quiz.setTitle(dto.getTitle());
        quiz.setPageSize(dto.getPageSize());
        quiz.setNavigationMode(
          Quiz.NavigationMode.valueOf(dto.getNavigationMode().name())
        );

        // replace questions
        List<Question> questions = dto.getQuestions().stream()
            .map(qdto -> {
                Question q = new Question();
                q.setText(qdto.getText());
                q.setQuestionType(qdto.getQuestionType());
                q.setOptions(qdto.getOptions());
                q.setCorrectAnswer(qdto.getCorrectAnswer());
                q.setWeight(qdto.getWeight());
                q.setQuiz(quiz);
                return q;
            })
            .collect(Collectors.toList());
        quiz.setQuestions(questions);
    }
}
