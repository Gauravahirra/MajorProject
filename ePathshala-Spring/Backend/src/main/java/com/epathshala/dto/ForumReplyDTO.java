package com.epathshala.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ForumReplyDTO {
    private Long id;
    private String content;
    private String authorName;
    private Long authorId;
    private Long threadId;
    private Long parentReplyId;
    private Integer replyNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ForumReplyDTO> childReplies;
} 