package com.epathshala.controller;

import com.epathshala.dto.ChatMessageDTO;
import com.epathshala.service.ChatService;
import com.epathshala.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;


import java.time.LocalDateTime;
import java.util.Map;

@Controller
public class WebSocketChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public ChatMessageDTO sendMessage(@Payload ChatMessageDTO chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        try {
            // Get user from session attributes (set during connection)
            Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
            if (sessionAttributes == null) {
                ChatMessageDTO errorMessage = new ChatMessageDTO();
                errorMessage.setMessage("Session not found");
                errorMessage.setMessageType("SYSTEM");
                errorMessage.setTimestamp(LocalDateTime.now());
                return errorMessage;
            }
            String userEmail = (String) sessionAttributes.get("userEmail");
            if (userEmail != null) {
                var user = userRepository.findByEmail(userEmail).orElse(null);
                if (user != null) {
                    chatMessage.setAuthorId(user.getId());
                    chatMessage.setAuthorName(user.getName());
                    chatMessage.setUserEmail(userEmail);
                    chatMessage.setUserRole(user.getRole());
                    chatMessage.setTimestamp(LocalDateTime.now());
                    chatMessage.setSessionId("ws_" + System.currentTimeMillis());
                    chatMessage.setResponse("Message sent successfully");
                    
                    // Handle different message types
                    if ("THREAD_CREATE".equals(chatMessage.getMessageType())) {
                        // Handle thread creation
                        chatMessage.setMessage("New thread created: " + chatMessage.getMessage());
                        chatMessage.setMessageType("SYSTEM");
                    }
                    
                    // Save message to database
                    ChatMessageDTO savedMessage = chatService.sendMessage(chatMessage, user.getId());
                    
                    // Broadcast to specific chat room
                    messagingTemplate.convertAndSend("/topic/chat." + chatMessage.getChatRoomId(), savedMessage);
                    
                    return savedMessage;
                }
            }
            
            // Return error message if user not authenticated
            ChatMessageDTO errorMessage = new ChatMessageDTO();
            errorMessage.setMessage("You must be logged in to send messages");
            errorMessage.setMessageType("SYSTEM");
            errorMessage.setTimestamp(LocalDateTime.now());
            return errorMessage;
            
        } catch (Exception e) {
            ChatMessageDTO errorMessage = new ChatMessageDTO();
            errorMessage.setMessage("Error sending message: " + e.getMessage());
            errorMessage.setMessageType("SYSTEM");
            errorMessage.setTimestamp(LocalDateTime.now());
            return errorMessage;
        }
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessageDTO addUser(@Payload ChatMessageDTO chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        try {
            // Get user from session attributes (set during connection)
            Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
            if (sessionAttributes == null) {
                ChatMessageDTO errorMessage = new ChatMessageDTO();
                errorMessage.setMessage("Session not found");
                errorMessage.setMessageType("SYSTEM");
                errorMessage.setTimestamp(LocalDateTime.now());
                return errorMessage;
            }
            String userEmail = (String) sessionAttributes.get("userEmail");
            if (userEmail != null) {
                var user = userRepository.findByEmail(userEmail).orElse(null);
                if (user != null) {
                    // Add username to web socket session
                    sessionAttributes.put("username", user.getName());
                    sessionAttributes.put("userEmail", userEmail);
                    sessionAttributes.put("userId", user.getId());
                    
                    // Create join message
                    ChatMessageDTO joinMessage = new ChatMessageDTO();
                    joinMessage.setMessage(user.getName() + " joined the chat!");
                    joinMessage.setMessageType("SYSTEM");
                    joinMessage.setAuthorName("System");
                    joinMessage.setTimestamp(LocalDateTime.now());
                    joinMessage.setSessionId("ws_" + System.currentTimeMillis());
                    joinMessage.setResponse("User joined successfully");
                    joinMessage.setUserEmail(userEmail);
                    joinMessage.setUserRole(user.getRole());
                    
                    return joinMessage;
                }
            }
            
            ChatMessageDTO errorMessage = new ChatMessageDTO();
            errorMessage.setMessage("Authentication required to join chat");
            errorMessage.setMessageType("SYSTEM");
            errorMessage.setTimestamp(LocalDateTime.now());
            return errorMessage;
            
        } catch (Exception e) {
            ChatMessageDTO errorMessage = new ChatMessageDTO();
            errorMessage.setMessage("Error joining chat: " + e.getMessage());
            errorMessage.setMessageType("SYSTEM");
            errorMessage.setTimestamp(LocalDateTime.now());
            return errorMessage;
        }
    }

    @MessageMapping("/chat.joinRoom")
    public void joinRoom(@Payload Map<String, Object> payload, SimpMessageHeaderAccessor headerAccessor) {
        try {
            Long roomId = Long.valueOf(payload.get("roomId").toString());
            Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
            if (sessionAttributes == null) {
                messagingTemplate.convertAndSendToUser(
                    "anonymous",
                    "/queue/errors",
                    Map.of("error", "Session not found")
                );
                return;
            }
            String userEmail = (String) sessionAttributes.get("userEmail");
            
            if (userEmail != null) {
                var user = userRepository.findByEmail(userEmail).orElse(null);
                
                if (user != null) {
                    // Join the specific room and get the system message
                    ChatMessageDTO joinMessage = chatService.joinChatRoom(roomId, user.getId());
                    
                    // Subscribe user to room-specific topic
                    messagingTemplate.convertAndSendToUser(
                        userEmail,
                        "/queue/room." + roomId,
                        Map.of("type", "JOIN", "roomId", roomId, "message", "Joined room " + roomId)
                    );
                    
                    // Broadcast the system message to all users in the room
                    messagingTemplate.convertAndSend("/topic/chat." + roomId, joinMessage);
                }
            }
        } catch (Exception e) {
            // Send error to user
            Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
            String email = sessionAttributes != null && sessionAttributes.get("userEmail") != null ? 
                         sessionAttributes.get("userEmail").toString() : "anonymous";
            
            messagingTemplate.convertAndSendToUser(
                email,
                "/queue/errors",
                Map.of("error", "Failed to join room: " + e.getMessage())
            );
        }
    }

    @MessageMapping("/chat.leaveRoom")
    public void leaveRoom(@Payload Map<String, Object> payload, SimpMessageHeaderAccessor headerAccessor) {
        try {
            Long roomId = Long.valueOf(payload.get("roomId").toString());
            Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
            if (sessionAttributes == null) {
                messagingTemplate.convertAndSendToUser(
                    "anonymous",
                    "/queue/errors",
                    Map.of("error", "Session not found")
                );
                return;
            }
            String userEmail = (String) sessionAttributes.get("userEmail");
            
            if (userEmail != null) {
                var user = userRepository.findByEmail(userEmail).orElse(null);
                
                if (user != null) {
                    // Leave the room and get the system message
                    ChatMessageDTO leaveMessage = chatService.leaveChatRoom(roomId, user.getId());
                    
                    // Broadcast the system message to all users in the room
                    messagingTemplate.convertAndSend("/topic/chat." + roomId, leaveMessage);
                }
            }
        } catch (Exception e) {
            // Handle error
            Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
            String email = sessionAttributes != null && sessionAttributes.get("userEmail") != null ? 
                         sessionAttributes.get("userEmail").toString() : "anonymous";
            
            messagingTemplate.convertAndSendToUser(
                email,
                "/queue/errors",
                Map.of("error", "Failed to leave room: " + e.getMessage())
            );
        }
    }

    @MessageMapping("/chat.moderate")
    public void moderateMessage(@Payload Map<String, Object> payload, SimpMessageHeaderAccessor headerAccessor) {
        try {
            Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
            if (sessionAttributes == null) {
                messagingTemplate.convertAndSendToUser(
                    "anonymous",
                    "/queue/errors",
                    Map.of("error", "Session not found")
                );
                return;
            }
            String userEmail = (String) sessionAttributes.get("userEmail");
            if (userEmail != null) {
                var user = userRepository.findByEmail(userEmail).orElse(null);
                
                if (user != null && "ADMIN".equals(user.getRole())) {
                    String action = (String) payload.get("action");
                    Long messageId = Long.valueOf(payload.get("messageId").toString());
                    
                    // Handle moderation actions
                    switch (action) {
                        case "delete":
                            chatService.deleteMessage(messageId, user.getId());
                            break;
                        case "flag":
                            chatService.flagMessage(messageId, user.getId());
                            break;
                        case "edit":
                            // Handle edit action
                            break;
                    }
                    
                    // Notify other users about moderation
                    ChatMessageDTO moderationMessage = new ChatMessageDTO();
                    moderationMessage.setMessage("Message has been " + action + "ed by moderator");
                    moderationMessage.setMessageType("SYSTEM");
                    moderationMessage.setAuthorName("System");
                    moderationMessage.setTimestamp(LocalDateTime.now());
                    
                    messagingTemplate.convertAndSend("/topic/public", moderationMessage);
                }
            }
        } catch (Exception e) {
            // Send error to user
            Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
            String email = sessionAttributes != null && sessionAttributes.get("userEmail") != null ? 
                         sessionAttributes.get("userEmail").toString() : "anonymous";
            
            messagingTemplate.convertAndSendToUser(
                email,
                "/queue/errors",
                Map.of("error", "Failed to moderate message: " + e.getMessage())
            );
        }
    }
} 