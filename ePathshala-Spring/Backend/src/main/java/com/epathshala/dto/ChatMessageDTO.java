package com.epathshala.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessageDTO {
    private Long id;
    private String message;
    private String authorName;
    private Long authorId;
    private Long chatRoomId;
    private String messageType;
    private String attachmentUrl;
    private LocalDateTime timestamp;
    private Boolean isUserMessage;
    private String sessionId;
    private String response;
    private String userEmail;
    private String userRole;
    private ChatMessageDTO replyTo;
    private Long threadId;
} 