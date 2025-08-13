package com.epathshala.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "exam_answers")
@EntityListeners(AuditingEntityListener.class)
public class ExamAnswer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    @JsonIgnore
    private ExamAttempt attempt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @JsonIgnore
    private ExamQuestion question;
    
    @NotNull
    @Column(nullable = false)
    private String selectedAnswer; // A, B, C, or D
    
    @Column(nullable = false)
    private Boolean isCorrect = false;
    
    @Column(nullable = false)
    private Integer marksObtained = 0;
    
    @Column(nullable = false)
    private Integer timeSpentSeconds = 0;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Constructors
    public ExamAnswer() {}
    
    public ExamAnswer(ExamAttempt attempt, ExamQuestion question, String selectedAnswer) {
        this.attempt = attempt;
        this.question = question;
        this.selectedAnswer = selectedAnswer;
        this.isCorrect = question.isCorrectAnswer(selectedAnswer);
        this.marksObtained = isCorrect ? question.getMarks() : 0;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public ExamAttempt getAttempt() {
        return attempt;
    }
    
    public void setAttempt(ExamAttempt attempt) {
        this.attempt = attempt;
    }
    
    public ExamQuestion getQuestion() {
        return question;
    }
    
    public void setQuestion(ExamQuestion question) {
        this.question = question;
    }
    
    public String getSelectedAnswer() {
        return selectedAnswer;
    }
    
    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }
    
    public Boolean getIsCorrect() {
        return isCorrect;
    }
    
    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
    
    public Integer getMarksObtained() {
        return marksObtained;
    }
    
    public void setMarksObtained(Integer marksObtained) {
        this.marksObtained = marksObtained;
    }
    
    public Integer getTimeSpentSeconds() {
        return timeSpentSeconds;
    }
    
    public void setTimeSpentSeconds(Integer timeSpentSeconds) {
        this.timeSpentSeconds = timeSpentSeconds;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Helper methods
    public void calculateMarks() {
        if (question != null) {
            this.isCorrect = question.isCorrectAnswer(selectedAnswer);
            if (isCorrect) {
                this.marksObtained = question.getMarks();
            } else if (attempt.getExam().getNegativeMarking()) {
                this.marksObtained = (int) (-question.getMarks() * attempt.getExam().getNegativeMarkingPercentage() / 100.0);
            } else {
                this.marksObtained = 0;
            }
        }
    }
    
    public String getCorrectAnswer() {
        return question != null ? question.getCorrectAnswer() : null;
    }
    
    public String getSelectedAnswerText() {
        return question != null ? question.getOptionByLetter(selectedAnswer) : null;
    }
    
    public String getCorrectAnswerText() {
        return question != null ? question.getOptionByLetter(question.getCorrectAnswer()) : null;
    }
} 