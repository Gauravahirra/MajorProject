package com.epathshala.config;

import com.epathshala.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    @Autowired
    private com.epathshala.security.CustomUserDetailsService userDetailsService;
    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder passwordEncoder) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder)
                .and().build();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeRequests(authz -> authz
                .antMatchers("/ws/**").permitAll() // Allow WebSocket connections
                .antMatchers("/api/auth/login").permitAll()
                .antMatchers("/api/auth/status").permitAll() // Allow status endpoint
                .antMatchers("/api/auth/test").permitAll() // Allow test endpoint
                .antMatchers("/api/auth/forgot-password", "/api/auth/verify-otp").permitAll()
                .antMatchers("/api/chatbot/health").permitAll()
                .antMatchers("/api/chatbot/**").authenticated()
                .antMatchers("/api/forum/categories").permitAll()
                .antMatchers("/api/forum/categories/*/threads").permitAll()
                .antMatchers("/api/forum/threads/*").permitAll()
                .antMatchers("/api/forum/threads/*/replies").permitAll()
                .antMatchers("/api/forum/**").authenticated()
                .antMatchers("/api/chat/rooms").permitAll()
                .antMatchers("/api/chat/rooms/*/messages").permitAll()
                .antMatchers("/api/chat/**").authenticated()
                .antMatchers(HttpMethod.GET, "/api/notifications/announcements").permitAll()
                .antMatchers(HttpMethod.POST, "/api/notifications/announcements").hasAnyRole("ADMIN", "TEACHER")
                .antMatchers("/api/notifications/**").authenticated()
                .antMatchers("/swagger-ui/**", "/swagger-ui.html", "/api-docs/**", "/v3/api-docs/**").permitAll()
                .antMatchers("/api/admin/**").hasRole("ADMIN")
                .antMatchers("/api/teacher/**").hasRole("TEACHER")
                .antMatchers("/api/faculty/**").hasRole("TEACHER") // Add faculty exam endpoints
                .antMatchers("/api/student/**").hasRole("STUDENT")
                .antMatchers("/api/parent/**").hasRole("PARENT")
                .antMatchers("/api/calendar/events").permitAll()
                .antMatchers("/api/calendar/**").authenticated()
                .antMatchers("/api/session/info/**", "/api/session/all", "/api/session/user/**", "/api/session/logout/**", "/api/session/logout-all/**").hasRole("ADMIN")
                .antMatchers("/api/session/my-sessions").authenticated()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}