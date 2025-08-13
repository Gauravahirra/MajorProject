package com.epathshala.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ChatResponse {
    private String message;
    private String response;
    private String sessionId;
    private LocalDateTime timestamp;
    private List<ChatMessageDTO> chatHistory;
    
    @Data
    public static class ChatMessageDTO {
        private String message;
        private String response;
        private Boolean isUserMessage;
        private LocalDateTime timestamp;
    }
} 