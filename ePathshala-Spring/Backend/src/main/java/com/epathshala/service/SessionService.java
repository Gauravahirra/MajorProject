package com.epathshala.service;

import com.epathshala.entity.Session;
import com.epathshala.entity.User;
import com.epathshala.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SessionService {
    
    @Autowired
    private SessionRepository sessionRepository;
    
    @Value("${session.timeout.minutes:30}")
    private int sessionTimeoutMinutes;
    
    @Value("${session.max-per-user:5}")
    private int maxSessionsPerUser;
    
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    @Transactional
    public void createSession(String sessionId, User user, HttpServletRequest request) {
        // Check if user has too many active sessions
        List<Session> activeSessions = sessionRepository.findByUserAndIsActiveTrue(user);
        if (activeSessions.size() >= maxSessionsPerUser) {
            // Logout oldest session
            Session oldestSession = activeSessions.stream()
                .min((s1, s2) -> s1.getLoginTime().compareTo(s2.getLoginTime()))
                .orElse(null);
            if (oldestSession != null) {
                invalidateSession(oldestSession.getSessionId(), "Max sessions limit reached");
            }
        }
        
        // Get client information
        String ipAddress = getClientIpAddress(request);
        String userAgent = request.getHeader("User-Agent");
        
        // Create new session
        Session session = new Session(sessionId, user, ipAddress, userAgent, sessionTimeoutMinutes);
        sessionRepository.save(session);
        
        System.out.println("✅ Session created: " + sessionId + " for user: " + user.getEmail());
    }
    
    @Transactional
    public void createSession(String sessionId, User user) {
        // Create session without request context (for testing)
        Session session = new Session(sessionId, user, "Unknown", "Unknown", sessionTimeoutMinutes);
        sessionRepository.save(session);
        
        System.out.println("✅ Session created: " + sessionId + " for user: " + user.getEmail());
    }
    
    @Transactional
    public void invalidateSession(String sessionId, String reason) {
        Optional<Session> sessionOpt = sessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.logout(reason);
            sessionRepository.save(session);
            System.out.println("✅ Session invalidated: " + sessionId + " - Reason: " + reason);
        } else {
            System.out.println("⚠️ Session not found: " + sessionId);
        }
    }
    
    @Transactional
    public void updateSessionActivity(String sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.updateActivity();
            sessionRepository.save(session);
        }
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getSessionInfo(String sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            Map<String, Object> info = new HashMap<>();
            info.put("sessionId", session.getSessionId());
            info.put("userId", session.getUser().getId());
            info.put("userEmail", session.getUser().getEmail());
            info.put("userName", session.getUser().getName());
            info.put("userRole", session.getUser().getRole());
            info.put("loginTime", session.getLoginTime().format(formatter));
            info.put("lastActivityTime", session.getLastActivityTime().format(formatter));
            info.put("expiryTime", session.getExpiryTime().format(formatter));
            info.put("ipAddress", session.getIpAddress());
            info.put("userAgent", session.getUserAgent());
            info.put("isActive", session.getIsActive());
            info.put("isExpired", session.isExpired());
            
            if (session.getLogoutTime() != null) {
                info.put("logoutTime", session.getLogoutTime().format(formatter));
                info.put("logoutReason", session.getLogoutReason());
            }
            
            return info;
        } else {
            return Map.of("error", "Session not found");
        }
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getAllActiveSessions() {
        List<Session> activeSessions = sessionRepository.findByIsActiveTrue();
        Map<String, Object> result = new HashMap<>();
        result.put("totalActiveSessions", activeSessions.size());
        result.put("sessions", activeSessions.stream().map(session -> {
            Map<String, Object> sessionInfo = new HashMap<>();
            sessionInfo.put("sessionId", session.getSessionId());
            sessionInfo.put("userId", session.getUser().getId());
            sessionInfo.put("userEmail", session.getUser().getEmail());
            sessionInfo.put("userName", session.getUser().getName());
            sessionInfo.put("userRole", session.getUser().getRole());
            sessionInfo.put("loginTime", session.getLoginTime().format(formatter));
            sessionInfo.put("lastActivityTime", session.getLastActivityTime().format(formatter));
            sessionInfo.put("expiryTime", session.getExpiryTime().format(formatter));
            sessionInfo.put("ipAddress", session.getIpAddress());
            sessionInfo.put("isExpired", session.isExpired());
            return sessionInfo;
        }).toList());
        
        return result;
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getUserSessions(Long userId) {
        User user = new User();
        user.setId(userId);
        List<Session> userSessions = sessionRepository.findByUser(user);
        
        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("totalSessions", userSessions.size());
        result.put("activeSessions", userSessions.stream().filter(session -> session.getIsActive()).count());
        result.put("sessions", userSessions.stream().map(session -> {
            Map<String, Object> sessionInfo = new HashMap<>();
            sessionInfo.put("sessionId", session.getSessionId());
            sessionInfo.put("loginTime", session.getLoginTime().format(formatter));
            sessionInfo.put("lastActivityTime", session.getLastActivityTime().format(formatter));
            sessionInfo.put("expiryTime", session.getExpiryTime().format(formatter));
            sessionInfo.put("ipAddress", session.getIpAddress());
            sessionInfo.put("isActive", session.getIsActive());
            sessionInfo.put("isExpired", session.isExpired());
            
            if (session.getLogoutTime() != null) {
                sessionInfo.put("logoutTime", session.getLogoutTime().format(formatter));
                sessionInfo.put("logoutReason", session.getLogoutReason());
            }
            
            return sessionInfo;
        }).toList());
        
        return result;
    }
    
    @Transactional
    public void invalidateAllUserSessions(Long userId, String reason) {
        User user = new User();
        user.setId(userId);
        List<Session> activeSessions = sessionRepository.findByUserAndIsActiveTrue(user);
        
        for (Session session : activeSessions) {
            session.logout(reason);
            sessionRepository.save(session);
        }
        
        System.out.println("✅ Invalidated " + activeSessions.size() + " sessions for user ID: " + userId);
    }
    
    @Transactional
    public boolean isSessionValid(String sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            return session.getIsActive() && !session.isExpired();
        }
        return false;
    }
    
    @Scheduled(fixedRate = 300000) // Run every 5 minutes
    @Transactional
    public void cleanupExpiredSessions() {
        LocalDateTime now = LocalDateTime.now();
        List<Session> expiredSessions = sessionRepository.findExpiredSessions(now);
        
        for (Session session : expiredSessions) {
            session.logout("Session expired");
            sessionRepository.save(session);
        }
        
        if (!expiredSessions.isEmpty()) {
            System.out.println("🧹 Cleaned up " + expiredSessions.size() + " expired sessions");
        }
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0];
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
} 