package com.example.lms.security;

import com.example.lms.entity.User;
import com.example.lms.repository.UserRepository;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import jakarta.servlet.http.*;

import java.io.IOException;

@Component
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public GoogleOAuth2SuccessHandler(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest req,
                                        HttpServletResponse res,
                                        Authentication auth) throws IOException {
        DefaultOAuth2User oauthUser = (DefaultOAuth2User) auth.getPrincipal();
        String email = oauthUser.getAttribute("email");
        if (email == null ||
           (!email.endsWith("@bethlehem.edu") && !email.endsWith("@gmail.com"))) {
            res.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid email domain");
            return;
        }

        User user = userRepository.findByEmail(email)
            .orElseGet(() -> {
                User u = new User();
                u.setEmail(email);
                u.setUsername(oauthUser.getAttribute("name"));
                u.setAuthProvider("google");
                u.setPassword("");
                u.setRole("STUDENT");
                return userRepository.save(u);
            });

        String accessToken  = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        String redirectUrl = UriComponentsBuilder
            .fromUriString("http://localhost:5173/login-success")
            .queryParam("accessToken", accessToken)
            .queryParam("refreshToken", refreshToken)
            .build()
            .toUriString();

        res.sendRedirect(redirectUrl);
    }
}
