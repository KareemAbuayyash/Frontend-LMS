package com.example.lms.controller;

import com.example.lms.audit.SystemActivityService;
import com.example.lms.dto.AuthRequest;
import com.example.lms.dto.AuthResponse;
import com.example.lms.dto.ForgotPasswordRequest;
import com.example.lms.dto.RegisterRequest;
import com.example.lms.dto.UserDTO;
import com.example.lms.entity.User;
import com.example.lms.mapper.UserMapper;
import com.example.lms.notification.Notification;
import com.example.lms.notification.NotificationService;
import com.example.lms.notification.NotificationType;
import com.example.lms.security.JwtUtil;
import com.example.lms.service.EmailService;
import com.example.lms.service.UserService;
import com.example.lms.repository.AdminRepository;
import com.example.lms.repository.UserRepository;
import com.example.lms.security.TokenBlacklist;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", methods = { RequestMethod.GET,
        RequestMethod.POST, RequestMethod.OPTIONS, RequestMethod.PUT, RequestMethod.DELETE })
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final SystemActivityService activity;
    private final NotificationService notificationService;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final TokenBlacklist tokenBlacklist;
    @Autowired
    private AdminRepository adminRepository;
    private final Map<String, Long> blacklist = new ConcurrentHashMap<>();

    public void addToken(String token, long expirationTime) {
        blacklist.put(token, expirationTime);
    }

    public boolean isTokenBlacklisted(String token) {
        Long expirationTime = blacklist.get(token);
        if (expirationTime == null || expirationTime < System.currentTimeMillis()) {
            blacklist.remove(token);
            return false;
        }
        return true;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request,
            Authentication authentication // ← Spring injects this
    ) {
        // 1) create the user
        User user = userService.createUser(request);

        // 2) figure out “who” did it
        String actor = (authentication != null)
                ? authentication.getName()
                : "self-registration";

        // 3) log with “by …”
        activity.logEvent(
                "USER_CREATED",
                String.format(
                        "User '%s' (ID: %d) registered with role %s by %s",
                        user.getUsername(),
                        user.getId(),
                        user.getRole(),
                        actor));

        // ───── notify all admins ─────
        String subject = "New user: " + user.getUsername();
        String message = String.format(
                "User '%s' (ID: %d) has just registered with role %s.",
                user.getUsername(), user.getId(), user.getRole());
        adminRepository.findAll().forEach(admin -> {
            Notification n = new Notification();
            n.setTo(admin.getUser().getUsername());
            n.setSubject(subject);
            n.setMessage(message);
            n.setType(NotificationType.EMAIL);
            notificationService.sendNotification(n);
        });
        // ──────────────────────────────

        return ResponseEntity.status(HttpStatus.CREATED).body(UserMapper.toDTO(user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        logger.info("Login attempt for username: {}", request.getUsername());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));
        User user = (User) authentication.getPrincipal();
        logger.info("Login successful for username: {}", user.getUsername());
        String jwtToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
        logger.info("Tokens generated successfully for username: {}", user.getUsername());
        return ResponseEntity.ok(new AuthResponse(jwtToken, refreshToken));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody Map<String, String> request) {
        logger.info("Refresh token request received");

        String refreshToken = request.get("refreshToken");

        if (refreshToken == null || refreshToken.isEmpty()) {
            logger.warn("Refresh token is missing or invalid");
            throw new IllegalArgumentException("Refresh token is missing or invalid");
        }

        try {
            String username = jwtUtil.extractUsername(refreshToken);
            logger.info("Extracted username from refresh token: {}", username);

            User user = userService.findByUsername(username);
            logger.info("User found for username: {}", username);

            String newAccessToken = jwtUtil.generateAccessToken(user);
            String newRefreshToken = jwtUtil.generateRefreshToken(user);
            logger.info("New tokens generated successfully for username: {}", username);

            return ResponseEntity.ok(new AuthResponse(newAccessToken, newRefreshToken));
        } catch (Exception e) {
            logger.error("Error processing the refresh token", e);
            throw new RuntimeException("Error processing the refresh token", e);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));

            userRepository.save(user);

            String resetLink = "http://localhost:5173/reset-password?token=" + token;
            try {
                emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
            } catch (MessagingException e) {
                System.err.println("Failed to send reset email: " + e.getMessage());
            }
        }

        return ResponseEntity.ok("Password reset link sent (if email is in our system).");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam("token") String token,
            @RequestParam("newPassword") String newPassword) {
        User user = userService.findByResetToken(token);

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Reset token is expired or invalid.");
        }

        userService.updatePassword(user, newPassword);

        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userService.updateUser(user);

        try {
            emailService.sendPasswordChangedConfirmation(user.getEmail(), user.getUsername(), newPassword);
        } catch (MessagingException e) {
            System.err.println("Failed to send 'password changed' email: " + e.getMessage());
        }

        return ResponseEntity.ok("Password has been reset successfully.");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            logger.warn("Invalid or missing Authorization header");
            return ResponseEntity.badRequest().body("Invalid or missing Authorization header");
        }

        String token = authorizationHeader.substring(7);
        tokenBlacklist.addToken(token);
        logger.info("Token invalidated successfully");
        return ResponseEntity.ok("Logged out successfully");
    }
    
}
