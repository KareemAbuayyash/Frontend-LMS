package com.example.lms.repository;

import com.example.lms.entity.Submission;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
  List<Submission> findByQuizIdAndStudentId(Long quizId, Long studentId);
  List<Submission> findByQuizId(Long quizId);


}
