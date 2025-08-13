package com.epathshala.repository;

import com.epathshala.entity.ExamAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamAnswerRepository extends JpaRepository<ExamAnswer, Long> {
    
    List<ExamAnswer> findByAttemptIdOrderByCreatedAtAsc(Long attemptId);
    
    List<ExamAnswer> findByQuestionId(Long questionId);
    
    List<ExamAnswer> findByAttemptIdAndIsCorrect(Long attemptId, Boolean isCorrect);
} 