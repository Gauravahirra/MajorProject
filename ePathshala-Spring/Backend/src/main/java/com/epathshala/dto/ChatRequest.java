package com.epathshala.dto;

import lombok.Data;

@Data
public class ChatRequest {
    private String message;
    private String sessionId;
    private String userRole;
    private String userEmail;
} 