package com.example.lms.repository;

import com.example.lms.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
  @Query("SELECT e FROM Enrollment e JOIN FETCH e.courses WHERE e.enrollmentId = :id")
Enrollment findByIdWithCourses(@Param("id") Long id);

}
