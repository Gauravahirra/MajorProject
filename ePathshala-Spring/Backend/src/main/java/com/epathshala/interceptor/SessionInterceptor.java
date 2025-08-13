package com.epathshala.interceptor;

import com.epathshala.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class SessionInterceptor implements HandlerInterceptor {

    @Autowired
    private SessionService sessionService;

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) throws IOException {
        // Skip session tracking for login endpoint and public endpoints
        String requestURI = request.getRequestURI();
        if (requestURI.equals("/api/auth/login") ||
            requestURI.startsWith("/swagger-ui/") || 
            requestURI.startsWith("/api-docs/") || 
            requestURI.startsWith("/v3/api-docs/")) {
            return true;
        }

        // For JWT-based authentication, we don't block requests
        // We only track session activity if session ID is available
        String sessionId = request.getHeader("X-Session-ID");
        if (sessionId == null) {
            sessionId = request.getParameter("sessionId");
        }

        // If session ID is available, update activity (but don't block if not available)
        if (sessionId != null && sessionService.isSessionValid(sessionId)) {
            sessionService.updateSessionActivity(sessionId);
        }
        
        // Always allow the request to proceed (JWT handles authentication)
        return true;
    }
} 