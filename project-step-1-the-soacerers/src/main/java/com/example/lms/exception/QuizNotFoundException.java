package com.example.lms.exception;

public class QuizNotFoundException extends RuntimeException {
  public QuizNotFoundException(String message) {
      super(message);
  }

  public QuizNotFoundException(Long quizId) {
      super("Quiz with ID " + quizId + " not found");
  }
}