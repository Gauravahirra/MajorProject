package com.epathshala.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Session {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String sessionId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private LocalDateTime loginTime;
    
    @Column(nullable = false)
    private LocalDateTime lastActivityTime;
    
    @Column(nullable = false)
    private LocalDateTime expiryTime;
    
    @Column(nullable = false)
    private String ipAddress;
    
    @Column(nullable = false)
    private String userAgent;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column
    private LocalDateTime logoutTime;
    
    @Column
    private String logoutReason;
    
    // Constructor for creating new sessions
    public Session(String sessionId, User user, String ipAddress, String userAgent, int sessionTimeoutMinutes) {
        this.sessionId = sessionId;
        this.user = user;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.loginTime = LocalDateTime.now();
        this.lastActivityTime = LocalDateTime.now();
        this.expiryTime = LocalDateTime.now().plusMinutes(sessionTimeoutMinutes);
        this.isActive = true;
    }
    
    // Method to update last activity
    public void updateActivity() {
        this.lastActivityTime = LocalDateTime.now();
    }
    
    // Method to check if session is expired
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryTime);
    }
    
    // Method to logout session
    public void logout(String reason) {
        this.isActive = false;
        this.logoutTime = LocalDateTime.now();
        this.logoutReason = reason;
    }
} 