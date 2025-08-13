package com.epathshala.interceptor;

import com.epathshala.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class SessionActivityInterceptor implements HandlerInterceptor {
    
    @Autowired
    private SessionService sessionService;
    
    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) throws Exception {
        // Extract session ID from Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // For now, we'll update session activity based on JWT token
            // In a more sophisticated implementation, you might want to extract session ID from JWT
            // or maintain a mapping between JWT tokens and session IDs
            
            // Update session activity if session ID is available in request attributes
            String sessionId = (String) request.getAttribute("sessionId");
            if (sessionId != null) {
                sessionService.updateSessionActivity(sessionId);
            }
        }
        
        return true;
    }
} 