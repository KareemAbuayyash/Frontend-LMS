package com.example.lms.service;

import com.example.lms.dto.RegisterRequest;
import com.example.lms.dto.UserDTO;
import com.example.lms.entity.User;
import com.example.lms.exception.UserAlreadyExistsException;
import com.example.lms.exception.UserNotFoundException;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    List<EntityModel<UserDTO>> findAll();

    User createUser(RegisterRequest newUser) throws UserAlreadyExistsException;

    UserDTO findById(Long id) throws UserNotFoundException;

    ResponseEntity<?> save(UserDTO newUser, Long id);

    ResponseEntity<?> deleteById(Long id);

    User findByEmail(String email);

    User findByUsername(String username);

    List<EntityModel<UserDTO>> findAllUsers();
    User findByResetToken(String token);
    void updateUser(User user);
    void updatePassword(User user, String rawPassword);
      }
