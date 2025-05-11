package com.example.lms.controller;

import com.example.lms.audit.SystemActivityService;
import com.example.lms.dto.AuthRequest;
import com.example.lms.dto.AuthResponse;
import com.example.lms.dto.ForgotPasswordRequest;
import com.example.lms.dto.RegisterRequest;
import com.example.lms.entity.User;
import com.example.lms.mapper.UserMapper;
import com.example.lms.notification.Notification;
import com.example.lms.notification.NotificationService;
import com.example.lms.notification.NotificationType;
import com.example.lms.repository.AdminRepository;
import com.example.lms.repository.UserRepository;
import com.example.lms.security.JwtUtil;
import com.example.lms.security.TokenBlacklist;
import com.example.lms.service.EmailService;
import com.example.lms.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS,
               RequestMethod.PUT, RequestMethod.DELETE}
)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    /* ───────────────────────────────── DI ─────────────────────────────────── */
    private final SystemActivityService activity;
    private final NotificationService   notificationService;
    private final UserService           userService;
    private final AuthenticationManager authenticationManager;
    private final EmailService          emailService;
    private final UserRepository        userRepository;
    private final JwtUtil               jwtUtil;
    private final TokenBlacklist        tokenBlacklist;
    private final AdminRepository       adminRepository;

    /* ─────────────── optional in-memory blacklist (quick demo only) ───────── */
    private final Map<String, Long> blacklist = new ConcurrentHashMap<>();
    public void addToken(String token, long exp) { blacklist.put(token, exp); }
    public boolean isTokenBlacklisted(String t) {
        Long exp = blacklist.get(t);
        if (exp == null || exp < System.currentTimeMillis()) { blacklist.remove(t); return false; }
        return true;
    }

    /* ─────────────────────────────── REGISTER ─────────────────────────────── */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req,
                                      Authentication auth) {

        User user  = userService.createUser(req);
        String who = (auth != null) ? auth.getName() : "self-registration";

        activity.logEvent("USER_CREATED",
                "User '%s' (ID:%d) registered with role %s by %s"
                        .formatted(user.getUsername(), user.getId(), user.getRole(), who));

        String subj = "New user: " + user.getUsername();
        String msg  = "User '%s' (ID:%d) registered with role %s."
                        .formatted(user.getUsername(), user.getId(), user.getRole());
        adminRepository.findAll().forEach(admin -> {
            Notification n = new Notification();
            n.setTo(admin.getUser().getUsername());
            n.setSubject(subj);
            n.setMessage(msg);
            n.setType(NotificationType.EMAIL);
            notificationService.sendNotification(n);
        });

        return ResponseEntity.status(HttpStatus.CREATED).body(UserMapper.toDTO(user));
    }

    /* ──────────────────────────────── LOGIN ───────────────────────────────── */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {

        logger.info("Login attempt: {}", req.getUsername());

        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    req.getUsername(), req.getPassword()));

            User user = (User) authentication.getPrincipal();

            String access  = jwtUtil.generateAccessToken(user);
            String refresh = jwtUtil.generateRefreshToken(user);

            return ResponseEntity.ok(new AuthResponse(access, refresh));

        } catch (BadCredentialsException ex) {
            /* Decide if it’s a wrong pwd or unknown user */
            boolean exists = userRepository.findByUsername(req.getUsername()).isPresent();
            String  msg    = exists ? "Wrong password" : "User not found";

            logger.warn("Login failed for '{}': {}", req.getUsername(), msg);
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.failure(msg));   // see new helper in AuthResponse
        }
    }

    /* ─────────────────────────── REFRESH TOKEN ────────────────────────────── */
    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refresh(@RequestBody Map<String,String> body) {

        String refreshToken = body.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.badRequest()
                                 .body(AuthResponse.failure("Refresh token is missing"));
        }

        try {
            String username = jwtUtil.extractUsername(refreshToken);
            User   user     = userService.findByUsername(username);

            String access  = jwtUtil.generateAccessToken(user);
            String refresh = jwtUtil.generateRefreshToken(user);

            return ResponseEntity.ok(new AuthResponse(access, refresh));

        } catch (Exception ex) {
            logger.error("Refresh-token error", ex);
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.failure("Invalid refresh token"));
        }
    }

    /* ───────────────────────── PASSWORD RESET FLOW ────────────────────────── */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {

        userRepository.findByEmail(req.getEmail()).ifPresent(user -> {
            user.setResetToken(UUID.randomUUID().toString());
            user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
            userRepository.save(user);

            String link = "http://localhost:5173/reset-password?token=" + user.getResetToken();
            try { emailService.sendPasswordResetEmail(user.getEmail(), link); }
            catch (MessagingException e) { logger.error("Mail error", e); }
        });

        return ResponseEntity.ok("If the email exists, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token,
                                           @RequestParam String newPassword) {

        User user = userService.findByResetToken(token);
        if (user.getResetTokenExpiry() == null ||
            user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {

            return ResponseEntity.badRequest().body("Reset token expired or invalid.");
        }

        userService.updatePassword(user, newPassword);
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userService.updateUser(user);

        try {
            emailService.sendPasswordChangedConfirmation(
                    user.getEmail(), user.getUsername(), newPassword);
        } catch (MessagingException e) { logger.error("Mail error", e); }

        return ResponseEntity.ok("Password has been reset.");
    }

    /* ─────────────────────────────── LOGOUT ───────────────────────────────── */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Invalid Authorization header");
        }

        String token = authHeader.substring(7);
        tokenBlacklist.addToken(token);
        logger.info("Token black-listed");

        return ResponseEntity.ok("Logged out");
    }
}
