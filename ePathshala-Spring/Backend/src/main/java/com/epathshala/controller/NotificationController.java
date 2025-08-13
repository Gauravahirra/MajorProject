package com.epathshala.controller;

import com.epathshala.dto.NotificationDTO;
import com.epathshala.service.NotificationService;
import com.epathshala.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/announcements")
    public List<NotificationDTO> getGlobalAnnouncements() {
        return notificationService.getGlobalAnnouncements();
    }

    @PostMapping("/announcements")
    public void createAnnouncement(@RequestBody Map<String, Object> announcement) {
        String title = (String) announcement.get("title");
        String content = (String) announcement.get("content");
        String targetRole = (String) announcement.get("targetRole");
        notificationService.createGlobalAnnouncement(title, content, targetRole);
    }

    @PostMapping("/assignment")
    public void notifyAssignment(@RequestBody Map<String, Object> assignment) {
        messagingTemplate.convertAndSend("/topic/assignment", assignment);
    }

    @PostMapping("/leaveApproval")
    public void notifyLeaveApproval(@RequestBody Map<String, Object> leave) {
        messagingTemplate.convertAndSend("/topic/leaveApproval", leave);
    }

    @GetMapping("/user")
    public Map<String, Object> getUserNotifications() {
        Long userId = getCurrentUserId();
        return notificationService.getUserNotifications(userId);
    }

    @GetMapping("/user/unread/count")
    public Map<String, Object> getUnreadCount() {
        Long userId = getCurrentUserId();
        return notificationService.getUnreadCount(userId);
    }

    @PostMapping("/mark-read/{notificationId}")
    public void markAsRead(@PathVariable Long notificationId) {
        Long userId = getCurrentUserId();
        notificationService.markAsRead(notificationId, userId);
    }

    @PostMapping("/mark-all-read")
    public void markAllAsRead() {
        Long userId = getCurrentUserId();
        notificationService.markAllAsRead(userId);
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            return userRepository.findByEmail(email)
                .map(user -> (Long) user.getId())
                .orElse(1L); // Default to admin user ID
        }
        return 1L; // Default to admin user ID
    }
}