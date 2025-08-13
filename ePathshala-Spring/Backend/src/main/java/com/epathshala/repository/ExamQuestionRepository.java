package com.epathshala.repository;

import com.epathshala.entity.ExamQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamQuestionRepository extends JpaRepository<ExamQuestion, Long> {
    
    List<ExamQuestion> findByExamIdOrderByCreatedAtAsc(Long examId);
    
    List<ExamQuestion> findByExamIdAndTopic(Long examId, String topic);
    
    List<ExamQuestion> findByExamIdAndDifficulty(Long examId, String difficulty);
    
    @Modifying
    @Query("DELETE FROM ExamQuestion eq WHERE eq.exam.id = :examId")
    void deleteByExamId(@Param("examId") Long examId);
} 