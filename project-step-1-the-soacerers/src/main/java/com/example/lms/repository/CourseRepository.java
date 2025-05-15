package com.example.lms.repository;

import com.example.lms.entity.Course;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findById(Long id);
    @Override
    @EntityGraph(attributePaths = {"instructor", "instructor.user"})
    Page<Course> findAll(Pageable pageable);
    @Modifying
  @Transactional
  @Query(
    value      = "DELETE FROM student_course WHERE course_id = :courseId",
    nativeQuery= true
  )
  void deleteStudentCourseLinks(@Param("courseId") Long courseId);


@Modifying @Transactional
@Query(value="DELETE FROM course_enrollment WHERE course_id = :courseId", nativeQuery=true)
void deleteCourseEnrollmentLinks(@Param("courseId") Long courseId);
// CourseRepository.java
@Modifying
@Transactional
@Query(
  value       = "DELETE FROM enrollment_courses WHERE course_id = :courseId",
  nativeQuery = true
)
void deleteEnrollmentCourseLinks(@Param("courseId") Long courseId);

}