package com.epathshala.controller;

import com.epathshala.entity.User;
import com.epathshala.repository.UserRepository;
import com.epathshala.util.PasswordUtility;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/password")
@Tag(name = "Password Management", description = "Password verification and management endpoints")
public class PasswordController {

    @Autowired
    private PasswordUtility passwordUtility;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/verify-sample-passwords")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Verify sample passwords against database hashes", 
               description = "Checks if the known sample passwords match their BCrypt hashes in the database")
    public ResponseEntity<Map<String, Object>> verifySamplePasswords() {
        try {
            // Get all users from database
            List<User> users = userRepository.findAll();
            
            // Create map of email to hashed password
            Map<String, String> userPasswords = users.stream()
                .collect(Collectors.toMap(User::getEmail, User::getPassword));
            
            // Verify passwords
            Map<String, Boolean> verificationResults = passwordUtility.verifyAllSamplePasswords(userPasswords);
            Map<String, String> samplePasswords = passwordUtility.getSamplePasswords();
            
            // Build response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password verification completed");
            response.put("totalUsers", users.size());
            response.put("samplePasswords", samplePasswords);
            response.put("verificationResults", verificationResults);
            
            // Print results to console for easy viewing
            passwordUtility.printPasswordVerificationResults(userPasswords);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to verify passwords: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Verify a specific password", 
               description = "Verify if a plain text password matches a BCrypt hash")
    public ResponseEntity<Map<String, Object>> verifyPassword(
            @RequestParam String email,
            @RequestParam String plainPassword) {
        try {
            User user = userRepository.findByEmail(email)
                .orElse(null);
            
            if (user == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "User not found with email: " + email);
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            boolean matches = passwordUtility.verifyPassword(plainPassword, user.getPassword());
            
            Map<String, Object> response = new HashMap<>();
            response.put("email", email);
            response.put("passwordMatches", matches);
            response.put("userName", user.getName());
            response.put("userRole", user.getRole());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to verify password: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Generate a new random password", 
               description = "Generate a new random password and its BCrypt hash")
    public ResponseEntity<Map<String, Object>> generatePassword() {
        try {
            String plainPassword = passwordUtility.generateRandomPassword();
            String hashedPassword = passwordUtility.encodePassword(plainPassword);
            
            Map<String, Object> response = new HashMap<>();
            response.put("plainPassword", plainPassword);
            response.put("hashedPassword", hashedPassword);
            response.put("message", "New password generated successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to generate password: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/sample-passwords")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get sample passwords", 
               description = "Get the known sample passwords for testing")
    public ResponseEntity<Map<String, Object>> getSamplePasswords() {
        try {
            Map<String, String> samplePasswords = passwordUtility.getSamplePasswords();
            
            Map<String, Object> response = new HashMap<>();
            response.put("samplePasswords", samplePasswords);
            response.put("message", "Sample passwords retrieved successfully");
            response.put("note", "These are the default passwords used in DataInitializer");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get sample passwords: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users with their password hashes", 
               description = "Get all users from database with their email and hashed passwords")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalUsers", users.size());
            response.put("users", users.stream().map(user -> {
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("email", user.getEmail());
                userInfo.put("name", user.getName());
                userInfo.put("role", user.getRole());
                userInfo.put("hashedPassword", user.getPassword());
                return userInfo;
            }).collect(Collectors.toList()));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get users: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/reset")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Admin reset user password",
        description = "Allows an ADMIN to directly reset a user's password by email"
    )
    public ResponseEntity<Map<String, Object>> resetUserPassword(
            @RequestParam String email,
            @RequestParam String newPassword) {
        try {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "User not found with email: " + email);
                return ResponseEntity.badRequest().body(errorResponse);
            }

            String hashed = passwordUtility.encodePassword(newPassword);
            user.setPassword(hashed);
            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password reset successfully");
            response.put("email", email);
            response.put("userId", user.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to reset password: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
} 