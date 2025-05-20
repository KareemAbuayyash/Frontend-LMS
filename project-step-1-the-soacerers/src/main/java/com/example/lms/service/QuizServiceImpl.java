package com.example.lms.service;

import com.example.lms.dto.QuizDTO;
import com.example.lms.entity.Course;
import com.example.lms.entity.Question;
import com.example.lms.entity.QuestionType;
import com.example.lms.entity.Quiz;
import com.example.lms.entity.Student;
import com.example.lms.entity.Submission;
import com.example.lms.exception.QuizNotFoundException;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.exception.SubmissionNotFoundException;
import com.example.lms.mapper.QuizMapper;
import com.example.lms.repository.QuizRepository;
import com.example.lms.repository.StudentRepository;
import com.example.lms.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private static final Logger logger = LoggerFactory.getLogger(QuizServiceImpl.class);

    private final QuizRepository quizRepository;
    private final SubmissionRepository submissionRepository;
    private final StudentRepository studentRepository;

    @Override
    public Quiz createQuiz(QuizDTO quizDTO) {
        logger.info("Creating a new quiz with title: {}", quizDTO.getTitle());
        Quiz quiz = QuizMapper.toEntity(quizDTO);
        Quiz savedQuiz = quizRepository.save(quiz);
        logger.info("Quiz created successfully with ID: {}", savedQuiz.getId());
        return savedQuiz;
    }
    
    @Override
    @Transactional
    public Quiz createQuizForCourse(Course course, QuizDTO quizDTO) {
        logger.info("Creating quiz for course ID: {}", course.getId());
        Quiz quiz = QuizMapper.toEntity(quizDTO);
        quiz.setCourse(course);
        Quiz savedQuiz = quizRepository.save(quiz);
        logger.info("Quiz created for course ID: {} with quiz ID: {}", course.getId(), savedQuiz.getId());
        return savedQuiz;
    }
    

    @Override
    @Transactional
    public Submission submitQuiz(Long quizId, Long studentId, List<String> answers) {
        logger.info("Submitting quiz with ID: {} for student ID: {}", quizId, studentId);

        Quiz quiz = quizRepository.findByIdWithQuestions(quizId)
                .orElseThrow(() -> new QuizNotFoundException(quizId));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        Course course = quiz.getCourse();
        if (course == null) {
            throw new ResourceNotFoundException("This quiz has no course assigned, cannot submit.");
        }

        boolean isEnrolled = student.getEnrolledCourses().stream()
                .anyMatch(c -> c.getId().equals(course.getId()));
        if (!isEnrolled) {
            throw new ResourceNotFoundException(
                    "Student (ID: " + studentId + ") is not enrolled in the course (ID: " + course.getId() + ").");
        }

        List<Submission> existingSubmissions = submissionRepository.findByQuizIdAndStudentId(quizId, studentId);
        if (!existingSubmissions.isEmpty()) {
            throw new ResourceNotFoundException(
                    "You have already submitted Quiz with ID: " + quizId + " and cannot submit again.");
        }

        int score = calculateScore(quiz, answers);

        Submission submission = new Submission();
        submission.setQuizId(quizId);
        submission.setStudentId(studentId);
        submission.setScore(score);
        submission.setAnswers(answers);
        submission.setSubmissionDate(LocalDateTime.now());
        submission.setGraded(false);

        Submission savedSubmission = submissionRepository.save(submission);
        logger.info("Quiz submitted successfully with submission ID: {}", savedSubmission.getId());
        return savedSubmission;
    }

//     private int calculateScore(Quiz quiz, List<String> answers) {
//     int score = 0;

//     for (int i = 0; i < quiz.getQuestions().size() && i < answers.size(); i++) {
//         Question q        = quiz.getQuestions().get(i);
//         String submitted  = answers.get(i) != null
//                               ? answers.get(i).trim().toLowerCase()
//                               : "";
//         String correctRaw = q.getCorrectAnswer() != null
//                               ? q.getCorrectAnswer().trim().toLowerCase()
//                               : "";

//         boolean correctMatch;

//         if (q.getQuestionType() == QuestionType.TRUE_FALSE) {
//             // true/false: ignore case
//             correctMatch = submitted.equals(correctRaw);

//         } else if (q.getQuestionType() == QuestionType.MULTIPLE_CHOICE_MULTIPLE) {
//             // split on commas, trim, collect into sets
//             var subSet = Arrays.stream(submitted.split(","))
//                                .map(String::trim)
//                                .filter(s -> !s.isEmpty())
//                                .collect(Collectors.toSet());
//             var corrSet = Arrays.stream(correctRaw.split(","))
//                                 .map(String::trim)
//                                 .filter(s -> !s.isEmpty())
//                                 .collect(Collectors.toSet());
//             correctMatch = subSet.equals(corrSet);

//         } else {
//             // single‐choice, essay, fill‐in: simple equalsIgnoreCase
//             correctMatch = submitted.equals(correctRaw);
//         }

//         if (correctMatch) {
//             score++;
//         }
//     }

//     return score;
// }
// private int calculateScore(Quiz quiz, List<String> answers) {
//     int score = 0;

//     for (int i = 0; i < quiz.getQuestions().size() && i < answers.size(); i++) {
//         Question q       = quiz.getQuestions().get(i);
//         String rawSub    = answers.get(i) != null ? answers.get(i) : "";
//         String rawCorr   = q.getCorrectAnswer()  != null ? q.getCorrectAnswer()  : "";

//         // normalize and split into sets
//         var studentSet = Arrays.stream(rawSub.split(","))
//                                .map(String::trim)
//                                .map(String::toLowerCase)
//                                .filter(s -> !s.isEmpty())
//                                .collect(Collectors.toSet());

//         var correctSet = Arrays.stream(rawCorr.split(","))
//                                .map(String::trim)
//                                .map(String::toLowerCase)
//                                .filter(s -> !s.isEmpty())
//                                .collect(Collectors.toSet());

//         if (q.getQuestionType() == QuestionType.TRUE_FALSE) {
//             // 1 point if matches
//             if (studentSet.size() == 1 && correctSet.contains(studentSet.iterator().next())) {
//                 score++;
//             }

//         } else if (q.getQuestionType() == QuestionType.MULTIPLE_CHOICE_MULTIPLE) {
//             // +1 for each correctly selected option
//             for (String ans : studentSet) {
//                 if (correctSet.contains(ans)) {
//                     score++;
//                 }
//             }

//         } else {
//             // single‐choice, essay, etc. – 1 point if exactly matches
//             if (studentSet.size() == 1 && correctSet.contains(studentSet.iterator().next())) {
//                 score++;
//             }
//         }
//     }

//     return score;
// }

// src/main/java/com/example/lms/service/QuizServiceImpl.java
 private int calculateScore(Quiz quiz, List<String> answers) {
        int total = 0;

        for (int i = 0; i < quiz.getQuestions().size() && i < answers.size(); i++) {
            Question q = quiz.getQuestions().get(i);
            int weight = q.getWeight() != null ? q.getWeight() : 1;

            String submittedRaw = answers.get(i) == null
                                 ? ""
                                 : answers.get(i).trim().toLowerCase();

            if (q.getQuestionType() == QuestionType.MULTIPLE_CHOICE_MULTIPLE) {
                Set<String> got = Arrays.stream(submittedRaw.split(","))
                                        .map(String::trim)
                                        .map(String::toLowerCase)
                                        .filter(s -> !s.isEmpty())
                                        .collect(Collectors.toSet());

                Set<String> want = Arrays.stream(q.getCorrectAnswer().split(","))
                                         .map(String::trim)
                                         .map(String::toLowerCase)
                                         .filter(s -> !s.isEmpty())
                                         .collect(Collectors.toSet());

                if (got.equals(want)) {
                    total += weight;
                }

            } else {
                // TRUE_FALSE or MULTIPLE_CHOICE_SINGLE
                String correctRaw = q.getCorrectAnswer().trim().toLowerCase();
                if (submittedRaw.equals(correctRaw)) {
                    total += weight;
                }
            }
        }

        return total;
    }



    @Override
    @Transactional
    public QuizDTO updateQuiz(Long id, QuizDTO quizDTO) {
        logger.info("Updating quiz with ID: {}", id);
        Quiz existingQuiz = quizRepository.findByIdWithQuestions(id)
                .orElseThrow(() -> new QuizNotFoundException(id));

        QuizMapper.updateEntity(quizDTO, existingQuiz);

        Quiz savedQuiz = quizRepository.save(existingQuiz);
        logger.info("Quiz with ID: {} updated successfully", id);
        return QuizMapper.toDTO(savedQuiz);
    }

    @Override
  @Transactional
  public void deleteQuiz(Long id) {
    if (!quizRepository.existsById(id)) {
      throw new QuizNotFoundException(id);
    }
    quizRepository.deleteById(id);
  }



    @Override
    @Transactional
    public Submission updateSubmission(Long submissionId, List<String> updatedAnswers) {
        logger.info("Updating submission with ID: {}", submissionId);
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new SubmissionNotFoundException(submissionId));
        submission.setAnswers(updatedAnswers);
        Quiz quiz = quizRepository.findByIdWithQuestions(submission.getQuizId())
                .orElseThrow(() -> new QuizNotFoundException(submission.getQuizId()));
        int newScore = calculateScore(quiz, updatedAnswers);
        submission.setScore(newScore);
        Submission updatedSubmission = submissionRepository.save(submission);
        logger.info("Submission with ID: {} updated successfully", submissionId);
        return updatedSubmission;
    }

    @Override
    @Transactional
    public Submission getSubmissionById(Long submissionId) {
        logger.info("Fetching submission with ID: {}", submissionId);
        return submissionRepository.findById(submissionId)
                .orElseThrow(() -> new SubmissionNotFoundException(submissionId));
    }

    @Override
    @Transactional
    public Quiz getQuizById(Long quizId) {
        logger.info("Fetching quiz with ID: {}", quizId);
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new QuizNotFoundException("Quiz not found with ID: " + quizId));
    }

    @Override
    @Transactional
    public List<Submission> getSubmissionsByQuizAndStudent(Long quizId, Long studentId) {
        logger.info("Fetching submissions for quiz ID: {} and student ID: {}", quizId, studentId);
        List<Submission> submissions = submissionRepository.findByQuizIdAndStudentId(quizId, studentId);
        logger.info("Fetched {} submissions", submissions.size());
        return submissions;
    }

    @Override
    @Transactional
    public Submission gradeQuizSubmission(Long submissionId, int newScore) {
        logger.info("Grading quiz submission manually with ID: {} to new score: {}", submissionId, newScore);
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new SubmissionNotFoundException(submissionId));
        submission.setScore(newScore);
        submission.setGraded(true);
        Submission updatedSubmission = submissionRepository.save(submission);
        logger.info("Quiz submission with ID: {} graded successfully with new score: {}", submissionId, newScore);
        return updatedSubmission;
    }

    @Override
    @Transactional
    public List<Submission> getSubmissionsByCourse(Long courseId) {
        logger.info("Fetching all submissions for course ID: {}", courseId);
        List<Quiz> quizzesInCourse = quizRepository.findAll().stream()
                .filter(q -> q.getCourse() != null && q.getCourse().getId().equals(courseId))
                .collect(Collectors.toList());
        List<Submission> submissions = quizzesInCourse.stream()
                .flatMap(quiz -> submissionRepository.findByQuizId(quiz.getId()).stream())
                .collect(Collectors.toList());
        logger.info("Fetched {} submissions for course ID: {}", submissions.size(), courseId);
        return submissions;
    }

    @Override
    public List<Submission> getSubmissionsByQuiz(Long quizId) {
        logger.info("Fetching all submissions for quiz ID: {}", quizId);
        List<Submission> submissions = submissionRepository.findByQuizId(quizId);
        logger.info("Fetched {} submissions for quiz ID: {}", submissions.size(), quizId);
        return submissions;
    }

    @Override
    @Transactional
    public List<Submission> getSubmissionsByQuizAndCourse(Long quizId, Long courseId) {
        logger.info("Fetching submissions for quiz ID: {} in course ID: {}", quizId, courseId);
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new QuizNotFoundException(quizId));

        if (quiz.getCourse() == null || !quiz.getCourse().getId().equals(courseId)) {
            throw new ResourceNotFoundException(
                    "Quiz with ID " + quizId + " is not part of course with ID " + courseId);
        }

        List<Submission> submissions = submissionRepository.findByQuizId(quizId);
        logger.info("Fetched {} submissions for quiz ID: {} in course ID: {}", submissions.size(), quizId, courseId);
        return submissions;
    }
@Override
public List<Quiz> findByCourseId(Long courseId) {
  return quizRepository.findByCourseIdWithQuestions(courseId);
}
}
