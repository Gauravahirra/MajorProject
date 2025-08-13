package com.epathshala.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ForumThreadDTO {
    private Long id;
    private String title;
    private String content;
    private String authorName;
    private Long authorId;
    private Long categoryId;
    private String categoryName;
    private Boolean isPinned;
    private Boolean isLocked;
    private Integer viewCount;
    private Integer replyCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastReplyAt;
    private List<ForumReplyDTO> replies;
} 