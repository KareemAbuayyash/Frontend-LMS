package com.example.lms.repository;

import com.example.lms.entity.Student;
import com.example.lms.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
  Student findByUser(User user);
}