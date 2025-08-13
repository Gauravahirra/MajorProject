package com.epathshala.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ChatRoomDTO {
    private Long id;
    private String name;
    private String description;
    private String category;
    private Boolean isActive;
    private Boolean isPrivate;
    private Integer maxUsers;
    private Integer currentUsers;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ChatMessageDTO> recentMessages;
} 