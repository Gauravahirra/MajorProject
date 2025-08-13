package com.epathshala.controller;

import com.epathshala.dto.ChatRoomDTO;
import com.epathshala.dto.ChatMessageDTO;
import com.epathshala.service.ChatService;
import com.epathshala.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "Chat", description = "Real-time chat management APIs")
public class ChatController {
    
    @Autowired
    private ChatService chatService;
    
    @Autowired
    private UserRepository userRepository;
    
    // Chat Room endpoints
    @GetMapping("/rooms")
    @Operation(summary = "Get all chat rooms")
    public ResponseEntity<List<ChatRoomDTO>> getAllChatRooms() {
        try {
            List<ChatRoomDTO> chatRooms = chatService.getAllChatRooms();
            return ResponseEntity.ok(chatRooms);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/rooms/public")
    @Operation(summary = "Get public chat rooms")
    public ResponseEntity<List<ChatRoomDTO>> getPublicChatRooms() {
        try {
            List<ChatRoomDTO> chatRooms = chatService.getPublicChatRooms();
            return ResponseEntity.ok(chatRooms);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/rooms/category/{category}")
    @Operation(summary = "Get chat rooms by category")
    public ResponseEntity<List<ChatRoomDTO>> getChatRoomsByCategory(@PathVariable String category) {
        try {
            List<ChatRoomDTO> chatRooms = chatService.getChatRoomsByCategory(category);
            return ResponseEntity.ok(chatRooms);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/rooms/paged")
    @Operation(summary = "Get paginated active chat rooms")
    public ResponseEntity<Page<ChatRoomDTO>> getActiveChatRooms(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return ResponseEntity.ok(chatService.getActiveChatRooms(pageable));
    }
    
    @PostMapping("/rooms")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new chat room")
    public ResponseEntity<ChatRoomDTO> createChatRoom(@RequestBody ChatRoomDTO chatRoomDTO) {
        try {
            ChatRoomDTO createdChatRoom = chatService.createChatRoom(chatRoomDTO);
            return ResponseEntity.ok(createdChatRoom);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/rooms/{roomId}")
    @Operation(summary = "Get chat room by ID")
    public ResponseEntity<ChatRoomDTO> getChatRoomById(@PathVariable Long roomId) {
        try {
            ChatRoomDTO chatRoom = chatService.getChatRoomById(roomId);
            return ResponseEntity.ok(chatRoom);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Chat Message endpoints
    @GetMapping("/rooms/{roomId}/messages")
    @Operation(summary = "Get messages by chat room")
    public ResponseEntity<Page<ChatMessageDTO>> getMessagesByChatRoom(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ChatMessageDTO> messages = chatService.getMessagesByChatRoom(roomId, pageable);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/messages")
    @Operation(summary = "Send a message to a chat room")
    public ResponseEntity<ChatMessageDTO> sendMessage(@RequestBody ChatMessageDTO messageDTO) {
        try {
            Long userId = getCurrentUserId();
            ChatMessageDTO sentMessage = chatService.sendMessage(messageDTO, userId);
            return ResponseEntity.ok(sentMessage);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not authenticated") || e.getMessage().contains("User not found")) {
                return ResponseEntity.status(403).body(null);
            }
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/rooms/{roomId}/join")
    @Operation(summary = "Join a chat room")
    public ResponseEntity<Map<String, String>> joinChatRoom(@PathVariable Long roomId) {
        try {
            Long userId = getCurrentUserId();
            chatService.joinChatRoom(roomId, userId);
            return ResponseEntity.ok(Map.of("message", "Successfully joined chat room"));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not authenticated") || e.getMessage().contains("User not found")) {
                return ResponseEntity.status(403).body(Map.of("error", "Authentication required"));
            }
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/rooms/{roomId}/leave")
    @Operation(summary = "Leave a chat room")
    public ResponseEntity<Map<String, String>> leaveChatRoom(@PathVariable Long roomId) {
        try {
            Long userId = getCurrentUserId();
            chatService.leaveChatRoom(roomId, userId);
            return ResponseEntity.ok(Map.of("message", "Successfully left chat room"));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not authenticated") || e.getMessage().contains("User not found")) {
                return ResponseEntity.status(403).body(Map.of("error", "Authentication required"));
            }
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Helper method to get current user ID
    private Long getCurrentUserId() {
        try {
            // Get the current authenticated user from security context
            org.springframework.security.core.Authentication authentication = 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication != null && authentication.isAuthenticated() && 
                !(authentication.getPrincipal() instanceof String) &&
                !"anonymousUser".equals(authentication.getName())) {
                
                // Get user by email from authentication
                String email = authentication.getName();
                com.epathshala.entity.User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
                return user.getId();
            }
            
            // If no authenticated user, throw exception
            throw new RuntimeException("User not authenticated");
        } catch (Exception e) {
            throw new RuntimeException("Failed to get current user ID: " + e.getMessage());
        }
    }
} 