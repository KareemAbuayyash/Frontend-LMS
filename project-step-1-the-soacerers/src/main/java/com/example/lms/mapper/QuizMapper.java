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
                qdto.setOptions(question.getOptions() != null ? question.getOptions() : List.of());
                return qdto;
            })
            .collect(Collectors.toList());
        dto.setQuestions(questionDTOs);
        return dto;
    }
    public static void updateEntity(QuizDTO quizDTO, Quiz quiz) {
      quiz.setTitle(quizDTO.getTitle());
      if (quizDTO.getQuestions() != null) {
          List<Question> questions = quizDTO.getQuestions()
                  .stream()
                  .map(qdto -> {
                      Question question = new Question();
                      question.setText(qdto.getText());
                      question.setCorrectAnswer(qdto.getCorrectAnswer());
                      question.setQuestionType(qdto.getQuestionType());
                      question.setOptions(qdto.getOptions() != null ? qdto.getOptions() : List.of());
                      question.setQuiz(quiz);
                      return question;
                  })
                  .collect(Collectors.toList());
          quiz.setQuestions(questions);
      }
  }
  
  public static Quiz toEntity(QuizDTO dto) {
    if (dto == null) {
        return null;
    }
    Quiz quiz = new Quiz();
    quiz.setTitle(dto.getTitle());
    
    if (dto.getQuestions() != null) {
        List<Question> questions = dto.getQuestions().stream()
            .map(qdto -> {
                Question question = new Question();
                question.setText(qdto.getText());
                question.setCorrectAnswer(qdto.getCorrectAnswer());
                question.setQuestionType(qdto.getQuestionType());
                question.setOptions(qdto.getOptions() != null ? qdto.getOptions() : List.of());
                // Do not set the quiz here yet. It can be done after the quiz object is created.
                return question;
            })
            .collect(Collectors.toList());
        quiz.setQuestions(questions);
        
        // Now set back-reference for each question.
        quiz.getQuestions().forEach(question -> question.setQuiz(quiz));
    }
    return quiz;
}
}
