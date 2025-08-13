package com.epathshala.repository;

import com.epathshala.entity.ForumThread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumThreadRepository extends JpaRepository<ForumThread, Long> {
    
    Page<ForumThread> findByCategoryIdOrderByIsPinnedDescLastReplyAtDesc(Long categoryId, Pageable pageable);
    
    Page<ForumThread> findByAuthorIdOrderByCreatedAtDesc(Long authorId, Pageable pageable);
    
    @Query("SELECT t FROM ForumThread t WHERE t.title LIKE %:search% OR t.content LIKE %:search% ORDER BY t.lastReplyAt DESC")
    Page<ForumThread> searchThreads(@Param("search") String search, Pageable pageable);
    
    List<ForumThread> findByIsPinnedTrueOrderByCreatedAtDesc();
    
    @Query("SELECT t FROM ForumThread t WHERE t.category.id = :categoryId ORDER BY t.lastReplyAt DESC")
    List<ForumThread> findRecentThreadsByCategory(@Param("categoryId") Long categoryId, Pageable pageable);
} 