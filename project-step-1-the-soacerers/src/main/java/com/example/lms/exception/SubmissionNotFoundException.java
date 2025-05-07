package com.example.lms.exception;

public class SubmissionNotFoundException extends RuntimeException {
    public SubmissionNotFoundException(Long submissionId) {
        super("Submission not found with ID: " + submissionId);
    }
}