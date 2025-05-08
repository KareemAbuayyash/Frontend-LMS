package com.example.lms.service;

import com.example.lms.assembler.UserModelAssembler;
import com.example.lms.dto.RegisterRequest;
import com.example.lms.dto.UserDTO;
import com.example.lms.dto.UserUpdateRequest;
import com.example.lms.entity.*;
import com.example.lms.mapper.UserMapper;
import com.example.lms.repository.*;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import com.example.lms.exception.UserAlreadyExistsException;
import com.example.lms.exception.UserNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

  private final UserRepository userRepository;
  private final InstructorRepository instructorRepository;
  private final StudentRepository studentRepository;
  private final AdminRepository adminRepository;
  private final PasswordEncoder passwordEncoder;
  private final UserModelAssembler userModelAssembler;

  @Override
  public List<EntityModel<UserDTO>> findAll() {
    logger.info("Fetching all users");
    List<EntityModel<UserDTO>> users = userRepository.findAll().stream()
        .map(UserMapper::toDTO)
        .map(userModelAssembler::toModel)
        .collect(Collectors.toList());
    logger.info("Fetched {} users", users.size());
    return users;
  }

  @Override
  public User createUser(RegisterRequest newUser) {
    logger.info("Creating user with username: {}", newUser.getUsername());
    if (userRepository.findByUsername(newUser.getUsername()).isPresent()) {
      logger.warn("Username already exists: {}", newUser.getUsername());
      throw new UserAlreadyExistsException("Username already exists: " + newUser.getUsername());
    }

    if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
      logger.warn("Email already exists: {}", newUser.getEmail());
      throw new UserAlreadyExistsException("Email already exists: " + newUser.getEmail());
    }

    User user = UserMapper.toEntity(newUser);
    user.setPassword(passwordEncoder.encode(newUser.getPassword()));
    user = userRepository.save(user);
    logger.info("User created successfully with ID: {}", user.getId());

    switch (user.getRole()) {
      case "INSTRUCTOR":
        Instructor instructor = new Instructor();
        instructor.setUser(user);
        instructor.setName(newUser.getName()); // Get name from the RegisterRequest parameter
        instructorRepository.save(instructor);
        break;

      case "STUDENT":
        Student student = new Student();
        student.setUser(user);
        studentRepository.save(student);
        logger.info("Student role assigned to user with ID: {}", user.getId());
        break;
      case "ADMIN":
        Admin admin = new Admin();
        admin.setUser(user);
        adminRepository.save(admin);
        logger.info("Admin role assigned to user with ID: {}", user.getId());
        break;
      default:
        logger.warn("Unknown role for user with ID: {}", user.getId());
        break;
    }

    return user;
  }

  @Override
  public UserDTO findById(Long id) throws UserNotFoundException {
    logger.info("Fetching user with ID: {}", id);
    User user = userRepository.findById(id)
        .orElseThrow(() -> {
          logger.error("User with ID: {} not found", id);
          return new UserNotFoundException(id);
        });
    logger.info("User with ID: {} fetched successfully", id);
    return UserMapper.toDTO(user);
  }

  @Override
public ResponseEntity<?> save(UserDTO newUser, Long id) {
    logger.info("Updating user with ID: {}", id);

    // First check for email/username conflicts exactly as before…
    userRepository.findByEmail(newUser.getEmail()).ifPresent(existing -> {
        if (!existing.getId().equals(id)) {
            logger.warn("Email already exists: {}", newUser.getEmail());
            throw new UserAlreadyExistsException("Email already exists: " + newUser.getEmail());
        }
    });
    userRepository.findByUsername(newUser.getUsername()).ifPresent(existing -> {
        if (!existing.getId().equals(id)) {
            logger.warn("Username already exists: {}", newUser.getUsername());
            throw new UserAlreadyExistsException("Username already exists: " + newUser.getUsername());
        }
    });

    // Now fetch & update the user
    User updatedUser = userRepository.findById(id)
        .map(user -> {
            user.setUsername(newUser.getUsername());

            // Only update password if the admin actually typed one
            if (newUser.getPassword() != null && !newUser.getPassword().isBlank()) {
                user.setPassword(passwordEncoder.encode(newUser.getPassword()));
            }

            user.setEmail(newUser.getEmail());
            user.setRole(newUser.getRole());
            user.setProfile(newUser.getProfile());
            logger.info("User with ID: {} updated successfully", id);
            return userRepository.save(user);
        })
        .orElseThrow(() -> {
            logger.error("User with ID: {} not found for update", id);
            return new UserNotFoundException(id);
        });

    HttpStatus status = userRepository.existsById(id) ? HttpStatus.OK : HttpStatus.CREATED;
    return ResponseEntity.status(status).body(UserMapper.toDTO(updatedUser));
}

  @Override
  public ResponseEntity<?> deleteById(Long id) {
    logger.info("Deleting user with ID: {}", id);
    var maybeUser = userRepository.findById(id);
    if (maybeUser.isEmpty()) {
      logger.warn("User with ID: {} not found", id);
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body("User with ID " + id + " not found");
    }
    User user = maybeUser.get();

    if ("INSTRUCTOR".equalsIgnoreCase(user.getRole())) {
      Instructor instructor = instructorRepository.findByUser(user);
      if (instructor != null) {
        instructorRepository.delete(instructor);
      }
    }

    if ("STUDENT".equalsIgnoreCase(user.getRole())) {
      Student student = studentRepository.findByUser(user);
      if (student != null) {
        studentRepository.delete(student);
      }
    }

    if ("ADMIN".equalsIgnoreCase(user.getRole())) {
      Admin admin = adminRepository.findByUser(user);
      if (admin != null) {
        adminRepository.delete(admin);
      }
    }

    userRepository.delete(user);
    logger.info("User with ID: {} deleted successfully", id);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }

  @Override
  public User loadUserByUsername(String username) throws UsernameNotFoundException {
    logger.info("Loading user by username: {}", username);
    return userRepository.findByUsername(username)
        .orElseThrow(() -> {
          logger.error("User not found with username: {}", username);
          return new UsernameNotFoundException("User not found with username: " + username);
        });
  }

  @Override
  public User findByEmail(String email) {
    logger.info("Fetching user by email: {}", email);
    return userRepository.findByEmail(email)
        .orElseThrow(() -> {
          logger.error("User not found with email: {}", email);
          return new UsernameNotFoundException(email);
        });
  }

  @Override
  public User findByUsername(String username) {
    logger.info("Fetching user by username: {}", username);
    return userRepository.findByUsername(username)
        .orElseThrow(() -> {
          logger.error("User not found with username: {}", username);
          return new UsernameNotFoundException(username);
        });
  }

  @Override
  public List<EntityModel<UserDTO>> findAllUsers() {
    logger.info("Fetching all users");
    List<EntityModel<UserDTO>> users = userRepository.findAll().stream()
        .map(UserMapper::toDTO)
        .map(userModelAssembler::toModel)
        .collect(Collectors.toList());
    logger.info("Fetched {} users", users.size());
    return users;
  }

  @Override
  public User findByResetToken(String token) {

    return userRepository.findAll().stream()
        .filter(u -> token.equals(u.getResetToken()))
        .findFirst()
        .orElseThrow(() -> new UsernameNotFoundException("Invalid reset token"));
  }

  @Override
  public void updateUser(User user) {
    userRepository.save(user);
  }

  @Override
  public void updatePassword(User user, String rawPassword) {
    user.setPassword(passwordEncoder.encode(rawPassword));
    userRepository.save(user);
  }
  @PutMapping("/{id}")
  public ResponseEntity<?> updateUser(
      @RequestBody @Valid UserUpdateRequest req,
      @PathVariable Long id
  ) {
      UserDTO dto = new UserDTO();
      dto.setUsername(req.getUsername());
      dto.setEmail(req.getEmail());
      dto.setRole(req.getRole());
      dto.setProfile(req.getProfile());
      dto.setPassword(req.getPassword());  

      return this.save(dto, id);
  }

}
