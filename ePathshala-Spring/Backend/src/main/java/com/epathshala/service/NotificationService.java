package com.epathshala.service;

import com.epathshala.dto.NotificationDTO;
import com.epathshala.entity.Notification;
import com.epathshala.entity.User;
import com.epathshala.repository.NotificationRepository;
import com.epathshala.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Page<NotificationDTO> getNotificationsForUser(Long userId, Pageable pageable) {
        return notificationRepository.findNotificationsForUser(userId, LocalDateTime.now(), pageable)
            .map(this::convertToDTO);
    }
    
    public Page<NotificationDTO> getUnreadNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId, pageable)
            .map(this::convertToDTO);
    }
    
    public Long getUnreadNotificationCount(Long userId) {
        return notificationRepository.countUnreadNotificationsByRecipientId(userId);
    }
    
    @Transactional
    public NotificationDTO createNotification(NotificationDTO notificationDTO) {
        Notification notification = new Notification();
        notification.setTitle(notificationDTO.getTitle());
        notification.setContent(notificationDTO.getContent());
        notification.setType(notificationDTO.getType());
        notification.setPriority(notificationDTO.getPriority());
        notification.setIsRead(false);
        notification.setIsGlobal(notificationDTO.getIsGlobal());
        notification.setTargetRole(notificationDTO.getTargetRole());
        notification.setExpiresAt(notificationDTO.getExpiresAt());
        notification.setActionUrl(notificationDTO.getActionUrl());
        notification.setActionText(notificationDTO.getActionText());
        
        if (notificationDTO.getSenderId() != null) {
            User sender = userRepository.findById(notificationDTO.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
            notification.setSender(sender);
        }
        
        if (notificationDTO.getRecipientId() != null) {
            User recipient = userRepository.findById(notificationDTO.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient not found"));
            notification.setRecipient(recipient);
        }
        
        Notification savedNotification = notificationRepository.save(notification);
        return convertToDTO(savedNotification);
    }
    
    @Transactional
    public void createForumNotification(String title, String content, String type, String priority,
                                     User sender, User recipient, String targetRole, String actionUrl, String actionText) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setContent(content);
        notification.setType(type);
        notification.setPriority(priority);
        notification.setSender(sender);
        notification.setRecipient(recipient);
        notification.setIsRead(false);
        notification.setIsGlobal(recipient == null);
        notification.setTargetRole(targetRole);
        notification.setExpiresAt(LocalDateTime.now().plusDays(7));
        notification.setActionUrl(actionUrl);
        notification.setActionText(actionText);
        
        notificationRepository.save(notification);
    }
    
    @Transactional
    public void createGlobalAnnouncement(String title, String content, String targetRole) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setContent(content);
        notification.setType("ANNOUNCEMENT");
        notification.setPriority("HIGH");
        notification.setIsRead(false);
        notification.setIsGlobal(true);
        notification.setTargetRole(targetRole);
        notification.setExpiresAt(LocalDateTime.now().plusDays(30));
        notification.setActionUrl("/announcements");
        notification.setActionText("View Announcement");
        
        notificationRepository.save(notification);
    }
    
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        // Check if user is the recipient or if it's a global notification
        if ((notification.getRecipient() != null && notification.getRecipient().getId().equals(userId)) ||
            notification.getIsGlobal()) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }
    
    @Transactional
    public void markAllAsRead(Long userId) {
        // Mark all unread notifications for the user as read
        List<Notification> unreadNotifications = notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId, Pageable.unpaged()).getContent();
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
        }
        notificationRepository.saveAll(unreadNotifications);
    }
    
    public List<NotificationDTO> getGlobalAnnouncements() {
        return notificationRepository.findByIsGlobalTrueAndExpiresAtAfterOrderByCreatedAtDesc(LocalDateTime.now())
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public Map<String, Object> getUserNotifications(Long userId) {
        Page<NotificationDTO> notifications = getNotificationsForUser(userId, Pageable.unpaged());
        return Map.of("content", notifications.getContent());
    }

    public Map<String, Object> getUnreadCount(Long userId) {
        Long count = getUnreadNotificationCount(userId);
        return Map.of("count", count);
    }
    
    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setContent(notification.getContent());
        dto.setType(notification.getType());
        dto.setPriority(notification.getPriority());
        dto.setSenderId(notification.getSender() != null ? notification.getSender().getId() : null);
        dto.setSenderName(notification.getSender() != null ? notification.getSender().getName() : null);
        dto.setRecipientId(notification.getRecipient() != null ? notification.getRecipient().getId() : null);
        dto.setRecipientName(notification.getRecipient() != null ? notification.getRecipient().getName() : null);
        dto.setIsRead(notification.getIsRead());
        dto.setIsGlobal(notification.getIsGlobal());
        dto.setTargetRole(notification.getTargetRole());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setExpiresAt(notification.getExpiresAt());
        dto.setActionUrl(notification.getActionUrl());
        dto.setActionText(notification.getActionText());
        return dto;
    }
} 