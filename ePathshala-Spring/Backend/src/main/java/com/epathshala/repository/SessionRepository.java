package com.epathshala.repository;

import com.epathshala.entity.Session;
import com.epathshala.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    
    Optional<Session> findBySessionId(String sessionId);
    
    List<Session> findByUser(User user);
    
    List<Session> findByUserAndIsActiveTrue(User user);
    
    List<Session> findByIsActiveTrue();
    
    @Query("SELECT s FROM Session s WHERE s.isActive = true AND s.expiryTime < :now")
    List<Session> findExpiredSessions(@Param("now") LocalDateTime now);
    
    @Query("SELECT s FROM Session s WHERE s.user.id = :userId AND s.isActive = true")
    List<Session> findActiveSessionsByUserId(@Param("userId") Long userId);
    
    @Modifying
    @Query("UPDATE Session s SET s.isActive = false, s.logoutTime = :logoutTime, s.logoutReason = :reason WHERE s.sessionId = :sessionId")
    void invalidateSession(@Param("sessionId") String sessionId, @Param("logoutTime") LocalDateTime logoutTime, @Param("reason") String reason);
    
    @Modifying
    @Query("UPDATE Session s SET s.lastActivityTime = :activityTime WHERE s.sessionId = :sessionId")
    void updateLastActivity(@Param("sessionId") String sessionId, @Param("activityTime") LocalDateTime activityTime);
    
    @Modifying
    @Query("UPDATE Session s SET s.isActive = false, s.logoutTime = :logoutTime, s.logoutReason = 'Session expired' WHERE s.expiryTime < :now")
    void expireSessions(@Param("now") LocalDateTime now, @Param("logoutTime") LocalDateTime logoutTime);
    
    long countByUserAndIsActiveTrue(User user);
    
    long countByIsActiveTrue();
} 