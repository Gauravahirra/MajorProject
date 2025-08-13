package com.epathshala.repository;

import com.epathshala.entity.ForumCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumCategoryRepository extends JpaRepository<ForumCategory, Long> {
    
    List<ForumCategory> findByIsActiveTrueOrderByNameAsc();
    
    @Query("SELECT c FROM ForumCategory c WHERE c.isActive = true ORDER BY c.threads.size DESC")
    List<ForumCategory> findActiveCategoriesOrderByThreadCount();
} 