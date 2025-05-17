package com.example.lms.repository;

import com.example.lms.entity.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    List<AssignmentSubmission> findByAssignmentId(Long assignmentId);
    AssignmentSubmission findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);
    @Modifying
  @Query("DELETE FROM AssignmentSubmission s WHERE s.assignment.id = :assignmentId")
  void deleteByAssignmentId(@Param("assignmentId") Long assignmentId);
}
