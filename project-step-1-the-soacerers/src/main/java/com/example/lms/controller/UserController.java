// src/main/java/com/example/lms/controller/UserController.java
package com.example.lms.controller;

import com.example.lms.audit.SystemActivityService;
import com.example.lms.dto.UserDTO;
import com.example.lms.dto.UserUpdateRequest;
import com.example.lms.entity.User;
import com.example.lms.exception.UserNotFoundException;
import com.example.lms.mapper.UserMapper;
import com.example.lms.service.StorageService;
import com.example.lms.service.UserService;
import com.example.lms.repository.AdminRepository;
import com.example.lms.notification.Notification;
import com.example.lms.notification.NotificationService;
import com.example.lms.notification.NotificationType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired private SystemActivityService activity;
    @Autowired private UserService userService;
    @Autowired private AdminRepository adminRepository;
    @Autowired private NotificationService notificationService;
    @Autowired private StorageService storageService;  
    @Autowired private com.example.lms.repository.UserRepository userRepository;

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
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            Authentication authentication) {

        UserDTO existing = userService.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        String actor = authentication.getName();
        String username = existing.getUsername();

        ResponseEntity<?> resp = userService.deleteById(id);

        // audit
        activity.logEvent(
            "USER_DELETED",
            String.format("User '%s' (ID: %d) was deleted by %s", username, id, actor)
        );

        // notify admins
        String subject = "User deleted: " + username;
        String message = String.format(
            "User '%s' (ID: %d) was deleted by %s", username, id, actor
        );
        adminRepository.findAll().forEach(admin -> {
            Notification n = new Notification();
            n.setTo(admin.getUser().getUsername());
            n.setSubject(subject);
            n.setMessage(message);
            n.setType(NotificationType.EMAIL);
            notificationService.sendNotification(n);
        });

        return resp;
    }

       @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR','STUDENT')")
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody UserDTO newUser,
            Authentication authentication) {

        // 1) Get the current User entity from the Authentication principal
        com.example.lms.entity.User currentUserEntity =
            (com.example.lms.entity.User) authentication.getPrincipal();
        Long currentUserId = currentUserEntity.getId();

        // 2) (Optional) fetch the before-state DTO if you need it
        UserDTO before = userService.findById(currentUserId);

        // 3) Save the changes
        ResponseEntity<?> response = userService.save(newUser, currentUserId);

        // 4) Audit log
        activity.logEvent(
            "USER_UPDATED",
            String.format(
              "User '%s' (ID: %d) updated own profile",
              currentUserEntity.getUsername(),
              currentUserId
            )
        );

        // 5) Notify admins
        String subject = "Profile updated: " + currentUserEntity.getUsername();
        String message = String.format(
            "User '%s' (ID: %d) updated their own profile.",
            currentUserEntity.getUsername(),
            currentUserId
        );
        adminRepository.findAll().forEach(admin -> {
            Notification n = new Notification();
            n.setTo(admin.getUser().getUsername());
            n.setSubject(subject);
            n.setMessage(message);
            n.setType(NotificationType.EMAIL);
            notificationService.sendNotification(n);
        });

        return response;
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @Valid @RequestBody UserUpdateRequest req,
            @PathVariable Long id,
            Authentication authentication) {

        // before
        UserDTO before = userService.findById(id);

        // build dto
        UserDTO dto = new UserDTO();
        dto.setUsername(req.getUsername());
        dto.setEmail(req.getEmail());
        dto.setRole(req.getRole());
        dto.setProfile(req.getProfile());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            dto.setPassword(req.getPassword());
        }

        // save
        ResponseEntity<?> response = userService.save(dto, id);

        // after
        UserDTO after = userService.findById(id);

        // diff
        List<String> changes = new ArrayList<>();
        if (!Objects.equals(before.getUsername(), after.getUsername())) {
            changes.add(String.format("username '%s' → '%s'", before.getUsername(), after.getUsername()));
        }
        if (!Objects.equals(before.getEmail(), after.getEmail())) {
            changes.add(String.format("email '%s' → '%s'", before.getEmail(), after.getEmail()));
        }
        if (!Objects.equals(before.getRole(), after.getRole())) {
            changes.add(String.format("role '%s' → '%s'", before.getRole(), after.getRole()));
        }
        if (!Objects.equals(before.getProfile(), after.getProfile())) {
            changes.add(String.format("profile '%s' → '%s'", before.getProfile(), after.getProfile()));
        }
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            changes.add("password changed");
        }
        String detail = changes.isEmpty() ? "no fields changed" : String.join(", ", changes);

        String actor = authentication.getName();
        // audit
        activity.logEvent(
            "USER_UPDATED",
            String.format("User (ID: %d) updated by %s: %s", id, actor, detail)
        );

        // notify admins
        String subject = "User updated: ID " + id;
        String message = String.format(
            "User (ID: %d) was updated by %s: %s", id, actor, detail
        );
        adminRepository.findAll().forEach(admin -> {
            Notification n = new Notification();
            n.setTo(admin.getUser().getUsername());
            n.setSubject(subject);
            n.setMessage(message);
            n.setType(NotificationType.EMAIL);
            notificationService.sendNotification(n);
        });

        return response;
    }
     @PreAuthorize("isAuthenticated()")
  @GetMapping("/profile")
  public ResponseEntity<UserDTO> getCurrentUser(Authentication auth) {
    // `auth.getPrincipal()` should be your UserDetails implementation
    com.example.lms.entity.User me = (com.example.lms.entity.User) auth.getPrincipal();
    UserDTO dto = userService.findById(me.getId());
    return ResponseEntity.ok(dto);
  }

// src/main/java/com/example/lms/controller/UserController.java
@PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR','STUDENT')")
    @PutMapping(
      path = "/profile/photo",
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UserDTO> updateProfileWithPhoto(
        @RequestParam String username,
        @RequestParam String email,
        @RequestParam(required = false) String password,
        @RequestParam(required = false) MultipartFile photo,
        Authentication auth
    ) {
        // 1) Identify current user
        var me = (com.example.lms.entity.User) auth.getPrincipal();
        Long id = me.getId();

        // 2) Load the JPA entity
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));

        // 3) Update only the fields the client provided
        user.setUsername(username);
        user.setEmail(email);

        if (password != null && !password.isBlank()) {
            user.setPassword(passwordEncoder.encode(password));
        }

        if (photo != null && !photo.isEmpty()) {
            String publicUrl = storageService.store(photo);
            user.setProfile(publicUrl);
        }

        // 4) Save and convert to DTO
        User updated = userRepository.save(user);
        UserDTO dto = UserMapper.toDTO(updated);

        // 5) Audit & notify admins
        activity.logEvent(
          "USER_UPDATED",
          String.format("User '%s' (ID: %d) updated own profile (including photo)", 
                        me.getUsername(), id)
        );
        String subject = "Profile updated: " + me.getUsername();
        String message = String.format("User '%s' (ID: %d) updated their profile.", 
                                       me.getUsername(), id);
        adminRepository.findAll().forEach(admin -> {
          Notification n = new Notification();
          n.setTo(admin.getUser().getUsername());
          n.setSubject(subject);
          n.setMessage(message);
          n.setType(NotificationType.EMAIL);
          notificationService.sendNotification(n);
        });

        return ResponseEntity.ok(dto);
    }




}
