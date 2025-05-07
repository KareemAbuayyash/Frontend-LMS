package com.example.lms.repository;

import com.example.lms.entity.Instructor;
import com.example.lms.entity.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {
  Instructor findByUser(User user);

  @Query("SELECT i FROM Instructor i LEFT JOIN FETCH i.courses WHERE i.id = :id")
Optional<Instructor> findByIdWithCourses(@Param("id") Long id);


}