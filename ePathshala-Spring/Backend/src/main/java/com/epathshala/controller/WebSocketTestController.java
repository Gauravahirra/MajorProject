package com.epathshala.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;
import java.util.Map;

@Controller
public class WebSocketTestController {

    @MessageMapping("/test")
    @SendTo("/topic/test")
    public Map<String, Object> testMessage(Map<String, Object> message) {
        return Map.of(
            "message", "Server received: " + message.get("message"),
            "timestamp", LocalDateTime.now().toString(),
            "status", "success"
        );
    }

    @GetMapping("/api/ws-test")
    @ResponseBody
    public Map<String, Object> testEndpoint() {
        return Map.of(
            "status", "WebSocket server is running",
            "timestamp", LocalDateTime.now().toString(),
            "endpoints", Map.of(
                "/ws", "STOMP WebSocket endpoint",
                "/ws-test", "Test WebSocket endpoint"
            )
        );
    }
} 