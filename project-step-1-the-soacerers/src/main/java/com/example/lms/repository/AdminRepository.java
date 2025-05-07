package com.example.lms.repository;

import com.example.lms.entity.Admin;
import com.example.lms.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
  Admin findByUser(User user);
}