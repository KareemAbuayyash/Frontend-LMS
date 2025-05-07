package com.example.lms.security;

import com.example.lms.entity.User;
import com.example.lms.repository.UserRepository;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Component
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public GoogleOAuth2SuccessHandler(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(jakarta.servlet.http.HttpServletRequest request,
                                        jakarta.servlet.http.HttpServletResponse response, Authentication authentication)
            throws IOException, jakarta.servlet.ServletException {

        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();
        String email = (String) oauthUser.getAttributes().get("email");

        if (email == null || (!email.endsWith("@bethlehem.edu") && !email.endsWith("@gmail.com"))) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid email domain. Only '@bethlehem.edu' or '@gmail.com' are allowed.");
            return;
        }

        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user;
        if (optionalUser.isPresent()) {
            user = optionalUser.get();
        } else {
            user = new User();
            user.setEmail(email);
            user.setUsername((String) oauthUser.getAttributes().get("name"));
            user.setAuthProvider("google");
            user.setPassword(""); 
            user.setRole("STUDENT");
            userRepository.save(user);
        }

        String accessToken = jwtUtil.generateAccessToken(user);
        String targetUrl = UriComponentsBuilder.fromUriString("/login-success")
                .queryParam("token", accessToken)
                .build().toUriString();

        response.sendRedirect(targetUrl);
    }
}
