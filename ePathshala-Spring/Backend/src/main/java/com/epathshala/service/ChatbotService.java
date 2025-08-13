package com.epathshala.service;

import com.epathshala.dto.ChatRequest;
import com.epathshala.dto.ChatResponse;
import com.epathshala.entity.ChatMessage;
import com.epathshala.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatbotService {
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    private static final List<String> PREDEFINED_QUESTIONS = List.of(
        "what is the academic calendar?",
        "how to check attendance?",
        "how to request leave?",
        "how to view grades?",
        "how to submit assignments?",
        "how to contact support?"
    );
    
    @Transactional
    public ChatResponse processMessage(ChatRequest request) {
        String sessionId = request.getSessionId() != null ? request.getSessionId() : UUID.randomUUID().toString();
        String userMessage = request.getMessage() != null ? request.getMessage() : "";
        String userRole = request.getUserRole();
        String userEmail = request.getUserEmail();
        // Extract author name from email or fallback
        String authorName = "Unknown";
        if (userEmail != null && userEmail.contains("@")) {
            authorName = userEmail.split("@")[0];
        }
        // Generate response based on message content and user role
        String response = generateResponse(userMessage, userRole);
        // Save the chat message
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSessionId(sessionId);
        chatMessage.setMessage(request.getMessage());
        chatMessage.setResponse(response);
        chatMessage.setUserRole(userRole);
        chatMessage.setUserEmail(userEmail);
        chatMessage.setAuthorName(authorName);
        chatMessage.setIsUserMessage(true);
        chatMessage.setTimestamp(LocalDateTime.now());
        chatMessage.setMessageType("TEXT");
        chatMessageRepository.save(chatMessage);
        
        // Get chat history
        List<ChatMessage> chatHistory = chatMessageRepository.getChatHistory(sessionId);
        
        // Convert to DTO
        List<ChatResponse.ChatMessageDTO> chatHistoryDTO = chatHistory.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        ChatResponse chatResponse = new ChatResponse();
        chatResponse.setMessage(request.getMessage());
        chatResponse.setResponse(response);
        chatResponse.setSessionId(sessionId);
        chatResponse.setTimestamp(LocalDateTime.now());
        chatResponse.setChatHistory(chatHistoryDTO);
        
        return chatResponse;
    }
    
    private String generateResponse(String message, String userRole) {
        if (message == null || message.trim().isEmpty()) {
            return "Please select a question from the predefined list.";
        }
        String normalized = message.trim().toLowerCase();
        for (String q : PREDEFINED_QUESTIONS) {
            if (normalized.equals(q.trim().toLowerCase())) {
                // Provide a canned answer for each
                switch (q) {
                    case "what is the academic calendar?":
                        return "The academic calendar lists all important dates and events. You can view it in your dashboard.";
                    case "how to check attendance?":
                        return "You can check your attendance records in the Attendance section of your dashboard.";
                    case "how to request leave?":
                        return "To request leave, go to the Leave section and submit a new request.";
                    case "how to view grades?":
                        return "Grades are available in the Grades section of your dashboard.";
                    case "how to submit assignments?":
                        return "Assignments can be submitted through the Assignments section. Upload your file and click submit.";
                    case "how to contact support?":
                        return "For support, please visit the Contact Us page or reach out to the school administration.";
                }
            }
        }
        return "Please select a question from the predefined list.";
    }
    
    private String generateAdminResponse(String message) {
        if (message.contains("user") || message.contains("manage")) {
            return "As an admin, you can manage users through the Admin Dashboard. You can add/edit students, teachers, and parents, and view all user sessions.";
        }
        
        if (message.contains("session") || message.contains("login")) {
            return "You can monitor active sessions and manage user logins through the Session Management section in your Admin Dashboard.";
        }
        
        if (message.contains("calendar") || message.contains("event")) {
            return "You can add and manage academic calendar events through the Admin Dashboard. This helps keep everyone informed about important dates.";
        }
        
        return "As an admin, you have access to comprehensive management features. Check your Admin Dashboard for user management, session monitoring, and calendar management.";
    }
    
    private String generateStudentResponse(String message) {
        if (message.contains("grade") || message.contains("mark")) {
            return "You can view your grades and marks in the Student Dashboard. Teachers update grades regularly, so check back often.";
        }
        
        if (message.contains("attendance")) {
            return "Your attendance records are available in the Student Dashboard. You can see your attendance history and current status.";
        }
        
        if (message.contains("assignment")) {
            return "Assignments are posted by your teachers and can be found in the Student Dashboard. You can download and submit assignments there.";
        }
        
        if (message.contains("leave")) {
            return "You can submit leave requests through the Student Dashboard. Your requests will be reviewed by teachers and parents.";
        }
        
        return "As a student, you can access your grades, attendance, assignments, and leave requests through the Student Dashboard.";
    }
    
    private String generateTeacherResponse(String message) {
        if (message.contains("grade") || message.contains("mark")) {
            return "You can update student grades through the Teacher Dashboard. This helps students and parents track academic progress.";
        }
        
        if (message.contains("attendance")) {
            return "You can mark student attendance and view attendance records through the Teacher Dashboard.";
        }
        
        if (message.contains("assignment")) {
            return "You can post assignments and view student submissions through the Teacher Dashboard.";
        }
        
        if (message.contains("leave")) {
            return "You can review and approve student leave requests through the Teacher Dashboard.";
        }
        
        return "As a teacher, you can manage grades, attendance, assignments, and leave requests through the Teacher Dashboard.";
    }
    
    private String generateParentResponse(String message) {
        if (message.contains("child") || message.contains("student")) {
            return "You can view your child's academic information including grades, attendance, and leave requests through the Parent Dashboard.";
        }
        
        if (message.contains("grade") || message.contains("progress")) {
            return "Your child's grades and academic progress are available in the Parent Dashboard. Check regularly for updates.";
        }
        
        if (message.contains("attendance")) {
            return "You can monitor your child's attendance records through the Parent Dashboard.";
        }
        
        if (message.contains("leave")) {
            return "You can review and approve your child's leave requests through the Parent Dashboard.";
        }
        
        return "As a parent, you can monitor your child's academic progress, attendance, and leave requests through the Parent Dashboard.";
    }
    
    private ChatResponse.ChatMessageDTO convertToDTO(ChatMessage chatMessage) {
        ChatResponse.ChatMessageDTO dto = new ChatResponse.ChatMessageDTO();
        dto.setMessage(chatMessage.getMessage());
        dto.setResponse(chatMessage.getResponse());
        dto.setIsUserMessage(chatMessage.getIsUserMessage());
        dto.setTimestamp(chatMessage.getTimestamp());
        return dto;
    }
    
    @Transactional
    public void clearChatHistory(String sessionId) {
        chatMessageRepository.deleteBySessionId(sessionId);
    }
} 