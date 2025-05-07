package com.example.lms.controller;

import com.example.lms.dto.UserDTO;
import com.example.lms.entity.User;
import com.example.lms.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public CollectionModel<EntityModel<UserDTO>> all() {
        logger.info("Request received to fetch all users");
        List<EntityModel<UserDTO>> users = userService.findAllUsers();
        logger.info("Fetched {} users", users.size());
        return CollectionModel.of(users);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STUDENT')")
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> one(@PathVariable Long id) {
        logger.info("Request received to fetch user with ID: {}", id);
        UserDTO user = userService.findById(id);
        logger.info("User with ID: {} fetched successfully", id);
        return ResponseEntity.ok(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> replaceUser(@Valid @RequestBody UserDTO newUser, @PathVariable Long id) {
        logger.info("Request received to update user with ID: {}", id);
        ResponseEntity<?> response = userService.save(newUser, id);
        logger.info("User with ID: {} updated successfully", id);
        return response;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        logger.info("Request received to delete user with ID: {}", id);
        ResponseEntity<?> response = userService.deleteById(id);
        logger.info("User with ID: {} deleted successfully", id);
        return response;
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR','STUDENT')")
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UserDTO newUser,
                                           Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        logger.info("Request received to update profile for user with ID: {}", currentUser.getId());
        ResponseEntity<?> response = userService.save(newUser, currentUser.getId());
        logger.info("Profile updated successfully for user with ID: {}", currentUser.getId());
        return response;
    }
}
