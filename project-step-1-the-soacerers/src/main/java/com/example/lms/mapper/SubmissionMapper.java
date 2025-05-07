package com.example.lms.mapper;

import com.example.lms.dto.SubmissionResponse;
import com.example.lms.entity.Submission;

public class SubmissionMapper {

    public static SubmissionResponse toResponse(Submission submission) {
        SubmissionResponse response = new SubmissionResponse();
        response.setId(submission.getId());
        response.setStudentId(submission.getStudentId());
        response.setQuizId(submission.getQuizId());
        response.setScore(submission.getScore());
        response.setAnswers(submission.getAnswers());
        response.setSubmissionDate(submission.getSubmissionDate());
        return response;
    }
}
