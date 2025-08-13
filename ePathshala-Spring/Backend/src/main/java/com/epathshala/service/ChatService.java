package com.epathshala.service;

import com.epathshala.dto.ChatRoomDTO;
import com.epathshala.dto.ChatMessageDTO;
import com.epathshala.dto.NotificationDTO;
import com.epathshala.entity.ChatRoom;
import com.epathshala.entity.ChatMessage;
import com.epathshala.entity.User;
import com.epathshala.repository.ChatRoomRepository;
import com.epathshala.repository.ChatMessageRepository;
import com.epathshala.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {
    
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    // Chat Room methods
    public List<ChatRoomDTO> getAllChatRooms() {
        return chatRoomRepository.findByIsActiveTrueOrderByNameAsc()
            .stream()
            .map(this::convertToChatRoomDTO)
            .collect(Collectors.toList());
    }
    
    public List<ChatRoomDTO> getChatRoomsByCategory(String category) {
        return chatRoomRepository.findByCategoryAndIsActiveTrue(category)
            .stream()
            .map(this::convertToChatRoomDTO)
            .collect(Collectors.toList());
    }
    
    public List<ChatRoomDTO> getPublicChatRooms() {
        return chatRoomRepository.findByIsPrivateFalseAndIsActiveTrue()
            .stream()
            .map(this::convertToChatRoomDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public ChatRoomDTO createChatRoom(ChatRoomDTO chatRoomDTO) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName(chatRoomDTO.getName());
        chatRoom.setDescription(chatRoomDTO.getDescription());
        chatRoom.setCategory(chatRoomDTO.getCategory());
        chatRoom.setIsActive(true);
        chatRoom.setIsPrivate(chatRoomDTO.getIsPrivate());
        chatRoom.setMaxUsers(chatRoomDTO.getMaxUsers());
        chatRoom.setCurrentUsers(0);
        
        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);
        return convertToChatRoomDTO(savedChatRoom);
    }
    
    @Transactional
    public ChatRoomDTO getChatRoomById(Long chatRoomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
            .orElseThrow(() -> new RuntimeException("Chat room not found"));
        return convertToChatRoomDTO(chatRoom);
    }
    
    public Page<ChatRoomDTO> getActiveChatRooms(Pageable pageable) {
        return chatRoomRepository.findByIsActiveTrue(pageable)
            .map(this::convertToChatRoomDTO);
    }
    
    // Chat Message methods
    public Page<ChatMessageDTO> getMessagesByChatRoom(Long chatRoomId, Pageable pageable) {
        return chatMessageRepository.findByChatRoomIdOrderByTimestampDesc(chatRoomId, pageable)
            .map(this::convertToChatMessageDTO);
    }
    
    @Transactional
    public ChatMessageDTO sendMessage(ChatMessageDTO messageDTO, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        ChatRoom chatRoom = chatRoomRepository.findById(messageDTO.getChatRoomId())
            .orElseThrow(() -> new RuntimeException("Chat room not found"));
        
        if (!chatRoom.getIsActive()) {
            throw new RuntimeException("Chat room is not active");
        }
        
        ChatMessage message = new ChatMessage();
        message.setMessage(messageDTO.getMessage());
        message.setAuthorName(user.getName());
        message.setAuthor(user);
        message.setChatRoom(chatRoom);
        message.setMessageType(messageDTO.getMessageType() != null ? messageDTO.getMessageType() : "TEXT");
        message.setAttachmentUrl(messageDTO.getAttachmentUrl());
        message.setIsUserMessage(true);
        
        // Handle reply to message
        if (messageDTO.getReplyTo() != null && messageDTO.getReplyTo().getId() != null) {
            ChatMessage replyToMessage = chatMessageRepository.findById(messageDTO.getReplyTo().getId())
                .orElse(null);
            message.setReplyTo(replyToMessage);
        }
        
        // Handle thread ID
        if (messageDTO.getThreadId() != null) {
            message.setThreadId(messageDTO.getThreadId());
        }
        
        // Set required fields
        message.setSessionId("session_" + System.currentTimeMillis());
        message.setResponse("Message sent successfully");
        message.setUserRole(user.getRole());
        message.setUserEmail(user.getEmail());
        message.setTimestamp(LocalDateTime.now());
        
        ChatMessage savedMessage = chatMessageRepository.save(message);
        
        // Create notification for @mentions
        if (messageDTO.getMessage().contains("@")) {
            createMentionNotifications(savedMessage, chatRoom);
        }
        
        return convertToChatMessageDTO(savedMessage);
    }
    
    @Transactional
    public ChatMessageDTO joinChatRoom(Long chatRoomId, Long userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
            .orElseThrow(() -> new RuntimeException("Chat room not found"));
        
        if (chatRoom.getCurrentUsers() >= chatRoom.getMaxUsers()) {
            throw new RuntimeException("Chat room is full");
        }
        
        chatRoom.setCurrentUsers(chatRoom.getCurrentUsers() + 1);
        chatRoomRepository.save(chatRoom);
        
        // Send system message
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        ChatMessage systemMessage = new ChatMessage();
        systemMessage.setMessage(user.getName() + " joined the chat");
        systemMessage.setAuthorName("System");
        systemMessage.setAuthor(user);
        systemMessage.setChatRoom(chatRoom);
        systemMessage.setMessageType("SYSTEM");
        systemMessage.setIsUserMessage(false);
        
        // Set required fields
        systemMessage.setSessionId("session_" + System.currentTimeMillis());
        systemMessage.setResponse("User joined successfully");
        systemMessage.setUserRole(user.getRole());
        systemMessage.setUserEmail(user.getEmail());
        systemMessage.setTimestamp(LocalDateTime.now());
        
        ChatMessage savedMessage = chatMessageRepository.save(systemMessage);
        return convertToChatMessageDTO(savedMessage);
    }
    
    @Transactional
    public ChatMessageDTO leaveChatRoom(Long chatRoomId, Long userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
            .orElseThrow(() -> new RuntimeException("Chat room not found"));
        
        chatRoom.setCurrentUsers(Math.max(0, chatRoom.getCurrentUsers() - 1));
        chatRoomRepository.save(chatRoom);
        
        // Send system message
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        ChatMessage systemMessage = new ChatMessage();
        systemMessage.setMessage(user.getName() + " left the chat");
        systemMessage.setAuthorName("System");
        systemMessage.setAuthor(user);
        systemMessage.setChatRoom(chatRoom);
        systemMessage.setMessageType("SYSTEM");
        systemMessage.setIsUserMessage(false);
        
        // Set required fields
        systemMessage.setSessionId("session_" + System.currentTimeMillis());
        systemMessage.setResponse("User left successfully");
        systemMessage.setUserRole(user.getRole());
        systemMessage.setUserEmail(user.getEmail());
        systemMessage.setTimestamp(LocalDateTime.now());
        
        ChatMessage savedMessage = chatMessageRepository.save(systemMessage);
        return convertToChatMessageDTO(savedMessage);
    }
    
    private void createMentionNotifications(ChatMessage message, ChatRoom chatRoom) {
        String messageText = message.getMessage();
        String[] words = messageText.split("\\s+");
        
        for (String word : words) {
            if (word.startsWith("@")) {
                String username = word.substring(1);
                User mentionedUser = userRepository.findByEmail(username + "@epathshala.com")
                    .orElse(null);
                
                if (mentionedUser != null) {
                    notificationService.createForumNotification(
                        "You were mentioned in chat",
                        message.getAuthorName() + " mentioned you in " + chatRoom.getName() + ": " + messageText,
                        "CHAT_MENTION",
                        "MEDIUM",
                        message.getAuthor(),
                        mentionedUser,
                        "ALL",
                        "/chat/room/" + chatRoom.getId(),
                        "View Chat"
                    );
                }
            }
        }
    }
    
    // Conversion methods
    private ChatRoomDTO convertToChatRoomDTO(ChatRoom chatRoom) {
        ChatRoomDTO dto = new ChatRoomDTO();
        dto.setId(chatRoom.getId());
        dto.setName(chatRoom.getName());
        dto.setDescription(chatRoom.getDescription());
        dto.setCategory(chatRoom.getCategory());
        dto.setIsActive(chatRoom.getIsActive());
        dto.setIsPrivate(chatRoom.getIsPrivate());
        dto.setMaxUsers(chatRoom.getMaxUsers());
        dto.setCurrentUsers(chatRoom.getCurrentUsers());
        dto.setCreatedAt(chatRoom.getCreatedAt());
        dto.setUpdatedAt(chatRoom.getUpdatedAt());
        return dto;
    }
    
    private ChatMessageDTO convertToChatMessageDTO(ChatMessage message) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(message.getId());
        dto.setMessage(message.getMessage());
        dto.setAuthorName(message.getAuthorName());
        dto.setAuthorId(message.getAuthor() != null ? message.getAuthor().getId() : null);
        dto.setChatRoomId(message.getChatRoom() != null ? message.getChatRoom().getId() : null);
        dto.setMessageType(message.getMessageType());
        dto.setAttachmentUrl(message.getAttachmentUrl());
        dto.setTimestamp(message.getTimestamp());
        dto.setIsUserMessage(message.getIsUserMessage());
        dto.setSessionId(message.getSessionId());
        dto.setResponse(message.getResponse());
        dto.setUserEmail(message.getUserEmail());
        dto.setUserRole(message.getUserRole());
        dto.setThreadId(message.getThreadId());
        
        // Handle reply to message
        if (message.getReplyTo() != null) {
            ChatMessageDTO replyToDto = new ChatMessageDTO();
            replyToDto.setId(message.getReplyTo().getId());
            replyToDto.setAuthorName(message.getReplyTo().getAuthorName());
            dto.setReplyTo(replyToDto);
        }
        
        return dto;
    }

    @Transactional
    public void deleteMessage(Long messageId, Long moderatorId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));
        
        // Check if user is admin or message author
        User moderator = userRepository.findById(moderatorId)
            .orElseThrow(() -> new RuntimeException("Moderator not found"));
        
        if (!"ADMIN".equals(moderator.getRole()) && !message.getAuthor().getId().equals(moderatorId)) {
            throw new RuntimeException("Unauthorized to delete this message");
        }
        
        chatMessageRepository.delete(message);
    }

    @Transactional
    public void flagMessage(Long messageId, Long moderatorId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));
        
        // Mark message as flagged
        message.setMessageType("FLAGGED");
        chatMessageRepository.save(message);
        
        // Create notification for admins
        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setTitle("Message flagged");
        notificationDTO.setContent("A message has been flagged for review");
        notificationDTO.setType("MODERATION");
        notificationDTO.setRecipientId(moderatorId);
        
        notificationService.createNotification(notificationDTO);
    }
} 