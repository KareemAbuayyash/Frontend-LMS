package com.example.lms.repository;

import com.example.lms.entity.Course;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findById(Long id);
    @Override
    @EntityGraph(attributePaths = {"instructor", "instructor.user"})
    Page<Course> findAll(Pageable pageable);
}