package com.example.lms.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import io.swagger.v3.oas.annotations.Hidden;

import java.nio.file.AccessDeniedException;
import java.util.Map;
import java.util.stream.Collectors;

@Hidden
@ControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
    logger.warn("Validation error occurred: {}", ex.getMessage());
    Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
        .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));

    ErrorResponse errorResponse = new ErrorResponse("Validation failed", errors.toString());
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
    logger.error("Data integrity violation: ", ex);

    // You can provide a more user-friendly message here
    String message = "Cannot perform the requested operation due to a data integrity constraint. " +
        "Please ensure there are no related records preventing this action.";

    // The details might be the root cause, or you can just use ex.getMessage()
    String details = ex.getMostSpecificCause() != null
        ? ex.getMostSpecificCause().getMessage()
        : ex.getMessage();

    ErrorResponse errorResponse = new ErrorResponse(message, details);
    return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
    logger.error("Resource not found: {}", ex.getMessage());
    ErrorResponse errorResponse = new ErrorResponse("Resource Not Found", ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(JwtTokenException.class)
  public ResponseEntity<ErrorResponse> handleJwtTokenException(JwtTokenException ex) {
    logger.error("JWT error occurred: {}", ex.getMessage());
    ErrorResponse errorResponse = new ErrorResponse("JWT Error", ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
    logger.warn("Invalid input: {}", ex.getMessage());
    ErrorResponse errorResponse = new ErrorResponse("Invalid Input", ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(UserAlreadyExistsException.class)
  public ResponseEntity<ErrorResponse> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
    logger.warn("User conflict: {}", ex.getMessage());
    ErrorResponse errorResponse = new ErrorResponse("Conflict", ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex) {
    logger.error("Bad credentials error: {}", ex.getMessage());
    ErrorResponse errorResponse = new ErrorResponse("Bad Credentials", "Invalid credentials or user not found");
    return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler({ AccessDeniedException.class, AuthorizationDeniedException.class })
  public ResponseEntity<ErrorResponse> handleAccessDenied(Exception ex) {
    logger.error("Access Denied: {}", ex.getMessage());
    ErrorResponse errorResponse = new ErrorResponse("Access Denied", ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
  }

  @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
  public ResponseEntity<ErrorResponse> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex) {
    logger.error("Media type not supported: {}", ex.getMessage());
    ErrorResponse errorResponse = new ErrorResponse("Unsupported Media Type", ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
    logger.error("Unhandled exception occurred: ", ex);
    ErrorResponse errorResponse = new ErrorResponse("Internal Server Error", "An unexpected error occurred.");
    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(DuplicateAssociationException.class)
  public ResponseEntity<ErrorResponse> handleDuplicateAssociation(DuplicateAssociationException ex) {
    logger.warn("Conflict: {}", ex.getMessage());
    ErrorResponse error = new ErrorResponse("Conflict", ex.getMessage());
    return new ResponseEntity<>(error, HttpStatus.CONFLICT);
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
    logger.warn("User not found: {}", ex.getMessage());
    ErrorResponse error = new ErrorResponse("Bad Request", ex.getMessage());
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }
  

}
