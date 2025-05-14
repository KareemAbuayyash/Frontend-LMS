package com.example.lms.service;

import com.example.lms.dto.QuizDTO;
import com.example.lms.entity.Course;
import com.example.lms.entity.Quiz;
import com.example.lms.entity.Submission;
import java.util.List;

public interface QuizService {
    Quiz createQuiz(QuizDTO quizDTO);
    Quiz createQuizForCourse(Course course, QuizDTO quizDTO);
    Submission submitQuiz(Long quizId, Long studentId, List<String> answers);
    Quiz getQuizById(Long quizId);
    QuizDTO updateQuiz(Long id, QuizDTO quizDTO);
    Submission updateSubmission(Long submissionId, List<String> updatedAnswers);
    Submission getSubmissionById(Long submissionId);
    List<Submission> getSubmissionsByQuizAndStudent(Long quizId, Long studentId);
    Submission gradeQuizSubmission(Long submissionId, int newScore);
    List<Submission> getSubmissionsByCourse(Long courseId);
    List<Submission> getSubmissionsByQuiz(Long quizId);
    List<Submission> getSubmissionsByQuizAndCourse(Long quizId, Long courseId);
List<Quiz> findByCourseId(Long courseId);

}
