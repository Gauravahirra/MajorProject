package com.epathshala.interceptor;

import org.springframework.lang.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class WebSocketInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        
        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Extract user information from headers
            String userEmail = accessor.getFirstNativeHeader("userEmail");
            String userId = accessor.getFirstNativeHeader("userId");
            String userName = accessor.getFirstNativeHeader("userName");
            
            if (userEmail != null) {
                // Store user information in session attributes
                accessor.setUser(() -> userEmail);
                Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
                if (sessionAttributes != null) {
                    sessionAttributes.put("userEmail", userEmail);
                    if (userId != null) {
                        sessionAttributes.put("userId", userId);
                    }
                    if (userName != null) {
                        sessionAttributes.put("userName", userName);
                    }
                }
            }
        }
        
        return message;
    }
} 