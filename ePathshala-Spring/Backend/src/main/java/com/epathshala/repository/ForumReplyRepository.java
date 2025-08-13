package com.epathshala.repository;

import com.epathshala.entity.ForumReply;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumReplyRepository extends JpaRepository<ForumReply, Long> {
    
    Page<ForumReply> findByThreadIdOrderByCreatedAtAsc(Long threadId, Pageable pageable);
    
    List<ForumReply> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
    
    @Query("SELECT COUNT(r) FROM ForumReply r WHERE r.thread.id = :threadId")
    Long countRepliesByThreadId(@Param("threadId") Long threadId);
    
    @Query("SELECT r FROM ForumReply r WHERE r.thread.id = :threadId AND r.parentReply IS NULL ORDER BY r.createdAt ASC")
    List<ForumReply> findTopLevelRepliesByThreadId(@Param("threadId") Long threadId);
    
    List<ForumReply> findByParentReplyOrderByCreatedAtAsc(ForumReply parentReply);
} 