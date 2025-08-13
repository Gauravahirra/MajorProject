package com.epathshala.repository;

import com.epathshala.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    Page<Notification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(Long recipientId, Pageable pageable);
    
    Page<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId, Pageable pageable);
    
    List<Notification> findByIsGlobalTrueAndExpiresAtAfterOrderByCreatedAtDesc(LocalDateTime now);
    
    List<Notification> findByTargetRoleAndExpiresAtAfterOrderByCreatedAtDesc(String targetRole, LocalDateTime now);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipient.id = :recipientId AND n.isRead = false")
    Long countUnreadNotificationsByRecipientId(@Param("recipientId") Long recipientId);
    
    @Query("SELECT n FROM Notification n WHERE (n.recipient.id = :userId OR n.isGlobal = true) AND n.expiresAt > :now ORDER BY n.createdAt DESC")
    Page<Notification> findNotificationsForUser(@Param("userId") Long userId, @Param("now") LocalDateTime now, Pageable pageable);
} 