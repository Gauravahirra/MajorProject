package com.epathshala.service;

import com.epathshala.dto.LoginRequest;
import com.epathshala.dto.VerifyOtpRequest;
import com.epathshala.entity.User;
import com.epathshala.entity.Otp;
import com.epathshala.repository.UserRepository;
import com.epathshala.repository.OtpRepository;
import com.epathshala.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private com.epathshala.security.CustomUserDetailsService userDetailsService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private SessionService sessionService;
    @Autowired
    private OtpRepository otpRepository;

    public Map<String, Object> login(LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
            .orElseThrow(() -> new BadCredentialsException("User not found"));
        if (!user.getRole().equalsIgnoreCase(req.getRole())) {
            throw new BadCredentialsException("Role mismatch");
        }
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getRole());
        
        // Generate session ID
        String sessionId = UUID.randomUUID().toString();
        
        // Create session with request context
        HttpServletRequest request = getCurrentRequest();
        if (request != null) {
            sessionService.createSession(sessionId, user, request);
        } else {
            sessionService.createSession(sessionId, user);
        }
        
        Map<String, Object> resp = new HashMap<>();
        resp.put("token", token);
        resp.put("sessionId", sessionId);
        resp.put("role", user.getRole());
        resp.put("userId", user.getId());
        resp.put("name", user.getName());
        resp.put("message", "Login successful");
        return resp;
    }

    public Map<String, Object> logout(String sessionId) {
        try {
            // Invalidate session
            sessionService.invalidateSession(sessionId, "User logout");
            
            // Invalidate HTTP session
            HttpSession session = getCurrentSession();
            if (session != null) {
                session.invalidate();
            }
            
            return Map.of("message", "Logout successful");
        } catch (Exception e) {
            return Map.of("error", "Error during logout: " + e.getMessage());
        }
    }

    @Transactional
    public Map<String, Object> forgotPassword(String email) {
        // Check if user exists
        if (!userRepo.findByEmail(email).isPresent()) {
            return Map.of("error", "User not found");
        }
        
        // Generate 6-digit OTP
        String otp = generateOtp();
        
        // Set expiration time (10 minutes from now)
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusMinutes(10);
        
        // Create OTP entity
        Otp otpEntity = new Otp(email, otp, now, expiresAt);
        otpRepository.save(otpEntity);
        
        // Display OTP in terminal for testing
        System.out.println("🔐 OTP for " + email + ": " + otp);
        System.out.println("⏰ OTP expires at: " + expiresAt);
        
        return Map.of(
            "message", "OTP sent to your email (check terminal for OTP)",
            "email", email,
            "expiresAt", expiresAt.toString()
        );
    }

    @Transactional
    public Map<String, Object> verifyOtpAndResetPassword(VerifyOtpRequest request) {
        // Check if user exists
        User user = userRepo.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            return Map.of("error", "User not found");
        }
        
        // Find valid OTP
        Optional<Otp> otpOptional = otpRepository.findByEmailAndOtpAndIsUsedFalse(
            request.getEmail(), request.getOtp());
        
        if (otpOptional.isEmpty()) {
            return Map.of("error", "Invalid OTP");
        }
        
        Otp otp = otpOptional.get();
        
        // Check if OTP is expired
        if (otp.isExpired()) {
            return Map.of("error", "OTP has expired");
        }
        
        // Mark OTP as used
        otp.setIsUsed(true);
        otpRepository.save(otp);
        
        // Update user password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepo.save(user);
        
        System.out.println("✅ Password reset successful for " + request.getEmail());
        
        return Map.of("message", "Password reset successful");
    }

    private String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    public Map<String, Object> getSessionInfo(String sessionId) {
        return sessionService.getSessionInfo(sessionId);
    }

    public Map<String, Object> getAllActiveSessions() {
        return sessionService.getAllActiveSessions();
    }

    public Map<String, Object> getUserSessions(Long userId) {
        return sessionService.getUserSessions(userId);
    }

    public Map<String, Object> invalidateAllUserSessions(Long userId) {
        sessionService.invalidateAllUserSessions(userId, "Admin request");
        return Map.of("message", "All sessions for user " + userId + " have been invalidated");
    }

    private HttpSession getCurrentSession() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                return attributes.getRequest().getSession(false);
            }
        } catch (Exception e) {
            // Session might not be available
        }
        return null;
    }

    private HttpServletRequest getCurrentRequest() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                return attributes.getRequest();
            }
        } catch (Exception e) {
            // Request might not be available
        }
        return null;
    }
}