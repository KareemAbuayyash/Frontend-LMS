package com.example.lms.service;

import com.example.lms.entity.Assignment;
import com.example.lms.entity.AssignmentSubmission;
import com.example.lms.entity.Student;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.AssignmentRepository;
import com.example.lms.repository.AssignmentSubmissionRepository;
import com.example.lms.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentSubmissionServiceImpl implements AssignmentSubmissionService {

    private static final Logger logger = LoggerFactory.getLogger(AssignmentSubmissionServiceImpl.class);

    private final AssignmentSubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;

    @Override
    public AssignmentSubmission submitAssignment(Long assignmentId, Long studentId, String submissionContent) {
        logger.info("Submitting assignment with ID: {} for student ID: {}", assignmentId, studentId);

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id " + assignmentId));
                if (assignment.getCourse() == null) {
                    throw new ResourceNotFoundException("Assignment with ID " + assignmentId + " is not associated with any course.");
                }
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + studentId));

        boolean enrolled = student.getEnrolledCourses().stream()
                .anyMatch(c -> c.getId().equals(assignment.getCourse().getId()));

        if (!enrolled) {
            throw new ResourceNotFoundException(
                    "Student (ID: " + studentId + ") is not enrolled in course ID: "
                            + assignment.getCourse().getId() + ".");
        }

        AssignmentSubmission submission = new AssignmentSubmission();
        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setSubmissionContent(submissionContent);
        submission.setSubmissionDate(LocalDateTime.now());
        submission.setGraded(false);
        submission.setScore(0);

        AssignmentSubmission savedSubmission = submissionRepository.save(submission);
        logger.info("Assignment submitted successfully with submission ID: {}", savedSubmission.getId());
        return savedSubmission;
    }

    @Override
    public AssignmentSubmission updateSubmission(Long submissionId, String updatedContent) {
        logger.info("Updating submission with ID: {}", submissionId);
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id " + submissionId));
        submission.setSubmissionContent(updatedContent);
        submission.setSubmissionDate(LocalDateTime.now());
        AssignmentSubmission updatedSubmission = submissionRepository.save(submission);
        logger.info("Submission updated successfully with ID: {}", submissionId);
        return updatedSubmission;
    }

    @Override
    public AssignmentSubmission gradeSubmission(Long submissionId, int score) {
        logger.info("Grading submission with ID: {}", submissionId);
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id " + submissionId));
        submission.setScore(score);
        submission.setGraded(true); 
        AssignmentSubmission gradedSubmission = submissionRepository.save(submission);
        logger.info("Submission graded successfully with ID: {} and score: {}", submissionId, score);
        return gradedSubmission;
    }

    @Override
    public List<AssignmentSubmission> getSubmissionsByAssignment(Long assignmentId) {
        logger.info("Fetching submissions for assignment with ID: {}", assignmentId);
        List<AssignmentSubmission> submissions = submissionRepository.findByAssignmentId(assignmentId);
        logger.info("Fetched {} submissions for assignment with ID: {}", submissions.size(), assignmentId);
        return submissions;
    }

    @Override
    public AssignmentSubmission getSubmissionByAssignmentAndStudent(Long assignmentId, Long studentId) {
        logger.info("Fetching submission for assignment ID: {} and student ID: {}", assignmentId, studentId);
        AssignmentSubmission submission = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId);
        if (submission == null) {
            throw new ResourceNotFoundException(
                    "Submission not found for assignment id " + assignmentId + " and student id " + studentId);
        }
        logger.info("Fetched submission with ID: {}", submission.getId());
        return submission;
    }
    @Override
    public AssignmentSubmission submitAssignment(Long assignmentId, Long studentId, String content, MultipartFile file) {
        // Implement file handling logic here if needed
        return submitAssignment(assignmentId, studentId, content);
    }

   
}
