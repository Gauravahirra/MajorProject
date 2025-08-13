package com.epathshala.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Long id;
    private String title;
    private String content;
    private String type;
    private String priority;
    private Long senderId;
    private String senderName;
    private Long recipientId;
    private String recipientName;
    private Boolean isRead;
    private Boolean isGlobal;
    private String targetRole;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private String actionUrl;
    private String actionText;
} 