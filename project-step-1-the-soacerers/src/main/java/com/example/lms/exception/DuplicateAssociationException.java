package com.example.lms.exception;

public class DuplicateAssociationException extends RuntimeException {
    public DuplicateAssociationException(String message) {
        super(message);
    }
}