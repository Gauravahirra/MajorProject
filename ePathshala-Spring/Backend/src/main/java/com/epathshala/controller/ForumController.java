package com.epathshala.controller;

import com.epathshala.dto.ForumCategoryDTO;
import com.epathshala.dto.ForumThreadDTO;
import com.epathshala.dto.ForumReplyDTO;
import com.epathshala.service.ForumService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import com.epathshala.entity.User;
import com.epathshala.repository.UserRepository;
import org.springframework.security.authentication.AnonymousAuthenticationToken;


import java.util.List;

@RestController
@RequestMapping("/api/forum")
@Tag(name = "Forum", description = "Forum management APIs")
public class ForumController {
    
    @Autowired
    private ForumService forumService;
    
    @Autowired
    private UserRepository userRepository;
    
    // Category endpoints
    @GetMapping("/categories")
    @Operation(summary = "Get all forum categories")
    public ResponseEntity<List<ForumCategoryDTO>> getAllCategories() {
        try {
            List<ForumCategoryDTO> categories = forumService.getAllCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new forum category")
    public ResponseEntity<ForumCategoryDTO> createCategory(@RequestBody ForumCategoryDTO categoryDTO) {
        try {
            ForumCategoryDTO createdCategory = forumService.createCategory(categoryDTO);
            return ResponseEntity.ok(createdCategory);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Thread endpoints
    @GetMapping("/categories/{categoryId}/threads")
    @Operation(summary = "Get threads by category")
    public ResponseEntity<Page<ForumThreadDTO>> getThreadsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ForumThreadDTO> threads = forumService.getThreadsByCategory(categoryId, pageable);
            return ResponseEntity.ok(threads);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/threads")
    @Operation(summary = "Create a new forum thread")
    public ResponseEntity<ForumThreadDTO> createThread(@RequestBody ForumThreadDTO threadDTO) {
        try {
            // Get user ID from security context
            Long userId = getCurrentUserId();
            ForumThreadDTO createdThread = forumService.createThread(threadDTO, userId);
            return ResponseEntity.ok(createdThread);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/threads/{threadId}")
    @Operation(summary = "Get thread by ID")
    public ResponseEntity<ForumThreadDTO> getThreadById(@PathVariable Long threadId) {
        try {
            ForumThreadDTO thread = forumService.getThreadById(threadId);
            return ResponseEntity.ok(thread);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/threads/{threadId}")
    @Operation(summary = "Update a forum thread")
    public ResponseEntity<ForumThreadDTO> updateThread(
            @PathVariable Long threadId,
            @RequestBody ForumThreadDTO threadDTO) {
        try {
            Long userId = getCurrentUserId();
            ForumThreadDTO updatedThread = forumService.updateThread(threadId, threadDTO, userId);
            return ResponseEntity.ok(updatedThread);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Reply endpoints
    @GetMapping("/threads/{threadId}/replies")
    @Operation(summary = "Get replies by thread")
    public ResponseEntity<Page<ForumReplyDTO>> getRepliesByThread(
            @PathVariable Long threadId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ForumReplyDTO> replies = forumService.getRepliesByThread(threadId, pageable);
            return ResponseEntity.ok(replies);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/replies")
    @Operation(summary = "Create a new forum reply")
    public ResponseEntity<ForumReplyDTO> createReply(@RequestBody ForumReplyDTO replyDTO) {
        try {
            Long userId = getCurrentUserId();
            ForumReplyDTO createdReply = forumService.createReply(replyDTO, userId);
            return ResponseEntity.ok(createdReply);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Search endpoints
    @GetMapping("/search")
    @Operation(summary = "Search forum threads")
    public ResponseEntity<Page<ForumThreadDTO>> searchThreads(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ForumThreadDTO> results = forumService.searchThreads(query, pageable);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Helper method to get current user ID
    private Long getCurrentUserId() {
        try {
            // Get current authentication from Spring Security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                !(authentication instanceof AnonymousAuthenticationToken)) {
                
                // Try to get user ID from principal
                Object principal = authentication.getPrincipal();
                if (principal instanceof UserDetails) {
                    // If using UserDetails, extract user ID from username or custom field
                    String username = ((UserDetails) principal).getUsername();
                    // You might need to implement a method to get user ID from username
                    return getUserRepository().findByEmail(username)
                        .map(User::getId)
                        .orElse(null);
                } else if (principal instanceof String) {
                    // If principal is just a string (username/email)
                    return getUserRepository().findByEmail((String) principal)
                        .map(User::getId)
                        .orElse(null);
                }
            }
        } catch (Exception e) {
            // Log the error but don't fail the request
            System.err.println("Error getting current user ID: " + e.getMessage());
        }
        
        // Fallback: return null or throw exception based on your requirements
        throw new RuntimeException("User not authenticated or user ID not found");
    }
    
    // Helper method to get UserRepository
    private UserRepository getUserRepository() {
        return userRepository;
    }
} 