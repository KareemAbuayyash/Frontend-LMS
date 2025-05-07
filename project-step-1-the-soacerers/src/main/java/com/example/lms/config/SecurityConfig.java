package com.example.lms.config;

import com.example.lms.security.JwtAuthenticationFilter;
import com.example.lms.security.JwtUtil;
import com.example.lms.security.GoogleOAuth2SuccessHandler;
import com.example.lms.security.TokenBlacklist;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final UserDetailsService userDetailsService;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;
  private final GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler;
  private final TokenBlacklist tokenBlacklist;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors().and()
        .csrf().disable()
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
            .anyRequest().authenticated())
        .exceptionHandling()
        .authenticationEntryPoint((request, response, authException) -> {
          response.sendError(
              HttpServletResponse.SC_UNAUTHORIZED,
              "Unauthorized: " + authException.getMessage());
        })
        .accessDeniedHandler((request, response, accessDeniedException) -> {
          response.sendError(
              HttpServletResponse.SC_FORBIDDEN,
              "Forbidden: " + accessDeniedException.getMessage());
        })
        .and()
        .oauth2Login()
        .loginPage("/login")
        .successHandler(googleOAuth2SuccessHandler)
        .and()
        .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration cfg = new CorsConfiguration();
    // <-- change this to your Vite URL
    cfg.setAllowedOrigins(List.of("http://localhost:5173"));  
    // include OPTIONS so pre-flights can succeed
    cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));  
    cfg.setAllowedHeaders(List.of("*"));
    cfg.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", cfg);
    return source;
}


  @Bean
  public JwtAuthenticationFilter jwtAuthenticationFilter() {
    return new JwtAuthenticationFilter(jwtUtil, userDetailsService, tokenBlacklist);
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
    return configuration.getAuthenticationManager();
  }

  @Bean
  public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder);
    return provider;
  }
}
