package com.epathshala.controller;

import com.epathshala.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/session")
@Tag(name = "Session Management", description = "Session management APIs")
public class SessionController {
    
    @Autowired
    private AuthService authService;

    @GetMapping("/info/{sessionId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get Session Info", description = "Get detailed information about a specific session (Admin Only)")
    public ResponseEntity<?> getSessionInfo(@PathVariable String sessionId) {
        return ResponseEntity.ok(authService.getSessionInfo(sessionId));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get All Active Sessions", description = "Get all currently active sessions (Admin Only)")
    public ResponseEntity<?> getAllActiveSessions() {
        return ResponseEntity.ok(authService.getAllActiveSessions());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get User Sessions", description = "Get all sessions for a specific user (Admin Only)")
    public ResponseEntity<?> getUserSessions(@PathVariable Long userId) {
        return ResponseEntity.ok(authService.getUserSessions(userId));
    }

    @PostMapping("/logout/{sessionId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Logout Session", description = "Force logout a specific session (Admin Only)")
    public ResponseEntity<?> logoutSession(@PathVariable String sessionId) {
        return ResponseEntity.ok(authService.logout(sessionId));
    }

    @PostMapping("/logout-all/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Logout All User Sessions", description = "Force logout all sessions for a specific user (Admin Only)")
    public ResponseEntity<?> logoutAllUserSessions(@PathVariable Long userId) {
        System.out.println("🔄 Admin requesting to logout all sessions for user ID: " + userId);
        try {
            Map<String, Object> result = authService.invalidateAllUserSessions(userId);
            System.out.println("✅ Successfully logged out all sessions for user ID: " + userId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.out.println("❌ Error logging out all sessions for user ID " + userId + ": " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to logout all sessions: " + e.getMessage()));
        }
    }

    @GetMapping("/my-sessions")
    @Operation(summary = "Get My Sessions", description = "Get current user's active sessions")
    public ResponseEntity<?> getMySessions(@RequestParam Long userId) {
        return ResponseEntity.ok(authService.getUserSessions(userId));
    }
} 