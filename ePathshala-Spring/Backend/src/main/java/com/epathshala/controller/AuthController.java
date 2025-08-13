package com.epathshala.controller;

import com.epathshala.dto.LoginRequest;
import com.epathshala.dto.ForgotPasswordRequest;
import com.epathshala.dto.VerifyOtpRequest;
import com.epathshala.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticate user and return JWT token")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/status")
    @Operation(summary = "Auth Status", description = "Check authentication service status")
    public ResponseEntity<?> getStatus() {
        Map<String, Object> status = Map.of(
            "status", "OK",
            "message", "Authentication service is running",
            "timestamp", System.currentTimeMillis()
        );
        return ResponseEntity.ok(status);
    }

    @PostMapping("/logout")
    @Operation(summary = "User Logout", description = "Logout user and invalidate session")
    public ResponseEntity<?> logout(@RequestParam String sessionId) {
        return ResponseEntity.ok(authService.logout(sessionId));
    }

    @GetMapping("/session/{sessionId}")
    @Operation(summary = "Get Session Info", description = "Get information about a specific session")
    public ResponseEntity<?> getSessionInfo(@PathVariable String sessionId) {
        return ResponseEntity.ok(authService.getSessionInfo(sessionId));
    }

    @GetMapping("/sessions")
    @Operation(summary = "Get All Active Sessions", description = "Get information about all active sessions (Admin Only)")
    public ResponseEntity<?> getAllSessions() {
        return ResponseEntity.ok(authService.getAllActiveSessions());
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Forgot Password", description = "Send password reset OTP to user email")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest req) {
        return ResponseEntity.ok(authService.forgotPassword(req.getEmail()));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP and Reset Password", description = "Verify OTP and reset password")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest req) {
        return ResponseEntity.ok(authService.verifyOtpAndResetPassword(req));
    }

    @GetMapping("/test")
    @Operation(summary = "Test Endpoint", description = "Simple test endpoint to verify API is working")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of(
            "message", "API is working!",
            "timestamp", System.currentTimeMillis(),
            "status", "success"
        ));
    }
}