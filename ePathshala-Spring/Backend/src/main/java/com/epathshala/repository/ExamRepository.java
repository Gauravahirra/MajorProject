package com.epathshala.repository;

import com.epathshala.entity.Exam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    
    // Find exams by course
    List<Exam> findByCourseIdOrderByStartTimeDesc(Long courseId);
    
    // Find active exams
    List<Exam> findByIsActiveTrueOrderByStartTimeDesc();
    
    // Find upcoming exams
    @Query("SELECT e FROM Exam e WHERE e.isActive = true AND e.startTime > :now ORDER BY e.startTime ASC")
    List<Exam> findUpcomingExams(@Param("now") LocalDateTime now);
    
    // Find currently active exams
    @Query("SELECT e FROM Exam e WHERE e.isActive = true AND e.startTime <= :now AND e.endTime >= :now ORDER BY e.startTime ASC")
    List<Exam> findCurrentlyActiveExams(@Param("now") LocalDateTime now);
    
    // Find completed exams
    @Query("SELECT e FROM Exam e WHERE e.endTime < :now ORDER BY e.endTime DESC")
    List<Exam> findCompletedExams(@Param("now") LocalDateTime now);
    
    // Find exams by faculty
    List<Exam> findByCreatedByIdOrderByCreatedAtDesc(Long facultyId);
    
    // Find exams by course and status
    @Query("SELECT e FROM Exam e WHERE e.course.id = :courseId AND e.isActive = :isActive ORDER BY e.startTime DESC")
    List<Exam> findByCourseIdAndIsActive(@Param("courseId") Long courseId, @Param("isActive") Boolean isActive);
    
    // Find exams with pagination
    Page<Exam> findByIsActiveTrue(Pageable pageable);
    
    // Find exams by course with pagination
    Page<Exam> findByCourseId(Long courseId, Pageable pageable);
    
    // Find exams by faculty with pagination
    Page<Exam> findByCreatedById(Long facultyId, Pageable pageable);
    
    // Search exams by title
    @Query("SELECT e FROM Exam e WHERE e.title LIKE %:title% AND e.isActive = true ORDER BY e.startTime DESC")
    List<Exam> searchByTitle(@Param("title") String title);
    
    // Count exams by status
    @Query("SELECT COUNT(e) FROM Exam e WHERE e.isActive = true AND e.startTime > :now")
    Long countUpcomingExams(@Param("now") LocalDateTime now);
    
    @Query("SELECT COUNT(e) FROM Exam e WHERE e.isActive = true AND e.startTime <= :now AND e.endTime >= :now")
    Long countCurrentlyActiveExams(@Param("now") LocalDateTime now);
    
    @Query("SELECT COUNT(e) FROM Exam e WHERE e.endTime < :now")
    Long countCompletedExams(@Param("now") LocalDateTime now);
} 