package com.epathshala.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ForumCategoryDTO {
    private Long id;
    private String name;
    private String description;
    private String color;
    private String icon;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long threadCount;
    private Long replyCount;
    private LocalDateTime lastActivity;
} 