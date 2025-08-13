package com.epathshala.repository;

import com.epathshala.entity.ExamAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamAttemptRepository extends JpaRepository<ExamAttempt, Long> {
    
    List<ExamAttempt> findByExamIdOrderByCreatedAtDesc(Long examId);
    
    List<ExamAttempt> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    
    Optional<ExamAttempt> findByExamIdAndStudentId(Long examId, Long studentId);
    
    @Query("SELECT ea FROM ExamAttempt ea WHERE ea.exam.id = :examId AND ea.status = :status")
    List<ExamAttempt> findByExamIdAndStatus(@Param("examId") Long examId, @Param("status") String status);
    
    @Query("SELECT ea FROM ExamAttempt ea WHERE ea.student.id = :studentId AND ea.status = :status")
    List<ExamAttempt> findByStudentIdAndStatus(@Param("studentId") Long studentId, @Param("status") String status);
    
    @Query("SELECT COUNT(ea) FROM ExamAttempt ea WHERE ea.exam.id = :examId")
    Long countByExamId(@Param("examId") Long examId);
    
    @Query("SELECT COUNT(ea) FROM ExamAttempt ea WHERE ea.student.id = :studentId")
    Long countByStudentId(@Param("studentId") Long studentId);
    
    List<ExamAttempt> findByExamId(Long examId);
} 