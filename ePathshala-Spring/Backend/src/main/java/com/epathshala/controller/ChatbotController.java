package com.epathshala.controller;

import com.epathshala.dto.ChatRequest;
import com.epathshala.dto.ChatResponse;
import com.epathshala.service.ChatbotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@Tag(name = "Chatbot", description = "AI Assistant for ePathshala")
public class ChatbotController {
    
    @Autowired
    private ChatbotService chatbotService;
    
    @GetMapping("/health")
    @Operation(summary = "Chatbot Health Check", description = "Simple health check to verify chatbot service is running")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "Chatbot service is running"));
    }
    
    @PostMapping("/chat")
    @Operation(summary = "Send Message to Chatbot", description = "Send a message to the AI assistant and get a response")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        try {
            ChatResponse response = chatbotService.processMessage(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
    
    @DeleteMapping("/clear/{sessionId}")
    @Operation(summary = "Clear Chat History", description = "Clear chat history for a specific session")
    public ResponseEntity<Map<String, String>> clearChatHistory(@PathVariable String sessionId) {
        try {
            chatbotService.clearChatHistory(sessionId);
            return ResponseEntity.ok(Map.of("message", "Chat history cleared successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to clear chat history"));
        }
    }
} 