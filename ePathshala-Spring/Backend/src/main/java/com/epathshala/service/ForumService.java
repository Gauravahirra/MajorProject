package com.epathshala.service;

import com.epathshala.dto.ForumCategoryDTO;
import com.epathshala.dto.ForumThreadDTO;
import com.epathshala.dto.ForumReplyDTO;
import com.epathshala.entity.ForumCategory;
import com.epathshala.entity.ForumThread;
import com.epathshala.entity.ForumReply;
import com.epathshala.entity.User;
import com.epathshala.repository.ForumCategoryRepository;
import com.epathshala.repository.ForumThreadRepository;
import com.epathshala.repository.ForumReplyRepository;
import com.epathshala.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ForumService {
    
    @Autowired
    private ForumCategoryRepository categoryRepository;
    
    @Autowired
    private ForumThreadRepository threadRepository;
    
    @Autowired
    private ForumReplyRepository replyRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    // Category methods
    public List<ForumCategoryDTO> getAllCategories() {
        return categoryRepository.findByIsActiveTrueOrderByNameAsc()
            .stream()
            .map(this::convertToCategoryDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public ForumCategoryDTO createCategory(ForumCategoryDTO categoryDTO) {
        ForumCategory category = new ForumCategory();
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());
        category.setColor(categoryDTO.getColor());
        category.setIcon(categoryDTO.getIcon());
        category.setIsActive(true);
        
        ForumCategory savedCategory = categoryRepository.save(category);
        return convertToCategoryDTO(savedCategory);
    }
    
    // Thread methods
    public Page<ForumThreadDTO> getThreadsByCategory(Long categoryId, Pageable pageable) {
        return threadRepository.findByCategoryIdOrderByIsPinnedDescLastReplyAtDesc(categoryId, pageable)
            .map(this::convertToThreadDTO);
    }
    
    @Transactional
    public ForumThreadDTO createThread(ForumThreadDTO threadDTO, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        ForumCategory category = categoryRepository.findById(threadDTO.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        ForumThread thread = new ForumThread();
        thread.setTitle(threadDTO.getTitle());
        thread.setContent(threadDTO.getContent());
        thread.setAuthorName(user.getName());
        thread.setAuthor(user);
        thread.setCategory(category);
        thread.setIsPinned(false);
        thread.setIsLocked(false);
        thread.setViewCount(0);
        thread.setReplyCount(0);
        
        ForumThread savedThread = threadRepository.save(thread);
        
        // Create notification for new thread
        notificationService.createForumNotification(
            "New Forum Thread",
            "A new thread '" + thread.getTitle() + "' has been created in " + category.getName(),
            "FORUM_THREAD",
            "MEDIUM",
            user,
            null,
            "ALL",
            "/forum/thread/" + savedThread.getId(),
            "View Thread"
        );
        
        return convertToThreadDTO(savedThread);
    }
    
    @Transactional
    public ForumThreadDTO getThreadById(Long threadId) {
        ForumThread thread = threadRepository.findById(threadId)
            .orElseThrow(() -> new RuntimeException("Thread not found"));
        
        // Increment view count
        thread.setViewCount(thread.getViewCount() + 1);
        threadRepository.save(thread);
        
        return convertToThreadDTO(thread);
    }
    
    @Transactional
    public ForumThreadDTO updateThread(Long threadId, ForumThreadDTO threadDTO, Long userId) {
        ForumThread thread = threadRepository.findById(threadId)
            .orElseThrow(() -> new RuntimeException("Thread not found"));
        
        if (!thread.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to edit this thread");
        }
        
        thread.setTitle(threadDTO.getTitle());
        thread.setContent(threadDTO.getContent());
        thread.setUpdatedAt(LocalDateTime.now());
        
        ForumThread savedThread = threadRepository.save(thread);
        return convertToThreadDTO(savedThread);
    }
    
    // Reply methods
    public Page<ForumReplyDTO> getRepliesByThread(Long threadId, Pageable pageable) {
        return replyRepository.findByThreadIdOrderByCreatedAtAsc(threadId, pageable)
            .map(this::convertToReplyDTO);
    }
    
    @Transactional
    public ForumReplyDTO createReply(ForumReplyDTO replyDTO, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        ForumThread thread = threadRepository.findById(replyDTO.getThreadId())
            .orElseThrow(() -> new RuntimeException("Thread not found"));
        
        if (thread.getIsLocked()) {
            throw new RuntimeException("Thread is locked");
        }
        
        ForumReply reply = new ForumReply();
        reply.setContent(replyDTO.getContent());
        reply.setAuthorName(user.getName());
        reply.setAuthor(user);
        reply.setThread(thread);
        reply.setParentReplyId(replyDTO.getParentReplyId());
        reply.setReplyNumber(replyRepository.countRepliesByThreadId(replyDTO.getThreadId()).intValue() + 1);
        
        ForumReply savedReply = replyRepository.save(reply);
        
        // Update thread reply count and last reply time
        thread.setReplyCount(thread.getReplyCount() + 1);
        thread.setLastReplyAt(LocalDateTime.now());
        threadRepository.save(thread);
        
        // Create notification for new reply
        if (!thread.getAuthor().getId().equals(userId)) {
            notificationService.createForumNotification(
                "New Reply to Your Thread",
                "Someone replied to your thread '" + thread.getTitle() + "'",
                "FORUM_REPLY",
                "MEDIUM",
                user,
                thread.getAuthor(),
                "ALL",
                "/forum/thread/" + replyDTO.getThreadId() + "#reply-" + savedReply.getId(),
                "View Reply"
            );
        }
        
        return convertToReplyDTO(savedReply);
    }
    
    // Search methods
    public Page<ForumThreadDTO> searchThreads(String search, Pageable pageable) {
        return threadRepository.searchThreads(search, pageable)
            .map(this::convertToThreadDTO);
    }
    
    // Conversion methods
    private ForumCategoryDTO convertToCategoryDTO(ForumCategory category) {
        ForumCategoryDTO dto = new ForumCategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setColor(category.getColor());
        dto.setIcon(category.getIcon());
        dto.setIsActive(category.getIsActive());
        dto.setCreatedAt(category.getCreatedAt());
        dto.setUpdatedAt(category.getUpdatedAt());
        dto.setThreadCount((long) category.getThreads().size());
        // Calculate reply count and last activity
        return dto;
    }
    
    private ForumThreadDTO convertToThreadDTO(ForumThread thread) {
        ForumThreadDTO dto = new ForumThreadDTO();
        dto.setId(thread.getId());
        dto.setTitle(thread.getTitle());
        dto.setContent(thread.getContent());
        dto.setAuthorName(thread.getAuthorName());
        dto.setAuthorId(thread.getAuthor().getId());
        dto.setCategoryId(thread.getCategory().getId());
        dto.setCategoryName(thread.getCategory().getName());
        dto.setIsPinned(thread.getIsPinned());
        dto.setIsLocked(thread.getIsLocked());
        dto.setViewCount(thread.getViewCount());
        dto.setReplyCount(thread.getReplyCount());
        dto.setCreatedAt(thread.getCreatedAt());
        dto.setUpdatedAt(thread.getUpdatedAt());
        dto.setLastReplyAt(thread.getLastReplyAt());
        return dto;
    }
    
    private ForumReplyDTO convertToReplyDTO(ForumReply reply) {
        ForumReplyDTO dto = new ForumReplyDTO();
        dto.setId(reply.getId());
        dto.setContent(reply.getContent());
        dto.setAuthorName(reply.getAuthorName());
        dto.setAuthorId(reply.getAuthor().getId());
        dto.setThreadId(reply.getThread().getId());
        dto.setParentReplyId(reply.getParentReply() != null ? reply.getParentReply().getId() : null);
        dto.setReplyNumber(reply.getReplyNumber());
        dto.setCreatedAt(reply.getCreatedAt());
        dto.setUpdatedAt(reply.getUpdatedAt());
        return dto;
    }
} 