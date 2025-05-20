package com.example.lms.controller;

import com.example.lms.dto.QuizDTO;
import com.example.lms.entity.Quiz;
import com.example.lms.mapper.QuizMapper;
import com.example.lms.service.QuizService;

import jakarta.validation.Valid;

import com.example.lms.repository.CourseRepository;
import com.example.lms.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private static final Logger logger = LoggerFactory.getLogger(QuizController.class);
    private final QuizService quizService;
    private final CourseRepository courseRepository;

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @PostMapping("/course/{courseId}")
    public ResponseEntity<QuizDTO> createQuizForCourse(
            @PathVariable Long courseId,
            @Valid @RequestBody QuizDTO quizDTO) {
        logger.info("Creating a new quiz for course ID: {}", courseId);
        var course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));
        Quiz quiz = quizService.createQuizForCourse(course, quizDTO);
        QuizDTO createdQuizDTO = QuizMapper.toDTO(quiz);
        logger.info("Quiz created successfully with ID: {} for course ID: {}", quiz.getId(), courseId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdQuizDTO);
    }
     @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR','STUDENT')")
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<QuizDTO>> getQuizzesForCourse(
      @PathVariable Long courseId
    ) {
      // pull back all quizzes for that course (with questions if you like)
      var quizzes = quizService.findByCourseId(courseId);
      var dtos = quizzes.stream()
                        .map(QuizMapper::toDTO)
                        .toList();
      return ResponseEntity.ok(dtos);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'STUDENT')")
    @GetMapping("/{quizId}")
    public ResponseEntity<QuizDTO> getQuizById(@PathVariable Long quizId) {
        logger.info("Fetching quiz with ID: {}", quizId);
        Quiz quiz = quizService.getQuizById(quizId);
        QuizDTO quizDTO = QuizMapper.toDTO(quiz);
        logger.info("Quiz with ID: {} fetched successfully", quizId);
        return ResponseEntity.ok(quizDTO);
    }

      @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
  @PutMapping("/{id}")
  public QuizDTO updateQuiz(
    @PathVariable Long id,
    @Valid @RequestBody QuizDTO dto
  ) {
    return quizService.updateQuiz(id, dto);
  }

  @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteQuiz(@PathVariable Long id) {
    quizService.deleteQuiz(id);
  }
}