package com.epathshala.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String sessionId;
    
    @Column(nullable = false)
    private String message;
    
    @Column(nullable = false)
    private String response;
    
    @Column(nullable = false)
    private String userRole;
    
    @Column(nullable = false)
    private String userEmail;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column(nullable = false)
    private Boolean isUserMessage = true;
    
    // New fields for real-time chat
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;
    
    @Column(nullable = false)
    private String authorName;
    
    @Column(nullable = false)
    private String messageType = "TEXT"; // TEXT, IMAGE, FILE, SYSTEM
    
    @Column(columnDefinition = "TEXT")
    private String attachmentUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_to_id")
    private ChatMessage replyTo;
    
    @Column
    private Long threadId;
    
    public ChatMessage(String sessionId, String message, String response, String userRole, String userEmail) {
        this.sessionId = sessionId;
        this.message = message;
        this.response = response;
        this.userRole = userRole;
        this.userEmail = userEmail;
        this.timestamp = LocalDateTime.now();
    }
    
    public ChatMessage(String message, String authorName, User author, ChatRoom chatRoom) {
        this.message = message;
        this.authorName = authorName;
        this.author = author;
        this.chatRoom = chatRoom;
        this.timestamp = LocalDateTime.now();
        this.isUserMessage = true;
        this.messageType = "TEXT";
    }
} 