package com.epathshala.repository;

import com.epathshala.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    
    List<ChatRoom> findByIsActiveTrueOrderByNameAsc();
    
    List<ChatRoom> findByCategoryAndIsActiveTrue(String category);
    
    List<ChatRoom> findByIsPrivateFalseAndIsActiveTrue();
    
    @Query("SELECT c FROM ChatRoom c WHERE c.isActive = true ORDER BY c.currentUsers DESC")
    List<ChatRoom> findActiveRoomsOrderByUserCount();

    Page<ChatRoom> findByIsActiveTrue(Pageable pageable);
} 