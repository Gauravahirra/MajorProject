package com.epathshala.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exams")
@EntityListeners(AuditingEntityListener.class)
public class Exam {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Exam title is required")
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    @Column(nullable = false)
    private Integer durationMinutes;
    
    @NotNull(message = "Start time is required")
    @Column(nullable = false)
    private LocalDateTime startTime;
    
    @NotNull(message = "End time is required")
    @Column(nullable = false)
    private LocalDateTime endTime;
    
    @NotNull(message = "Total marks is required")
    @Positive(message = "Total marks must be positive")
    @Column(nullable = false)
    private Integer totalMarks;
    
    @Column(nullable = false)
    private Boolean negativeMarking = false;
    
    @Column(nullable = false)
    private Double negativeMarkingPercentage = 0.0;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnore
    private com.epathshala.entity.Teacher course;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    @JsonIgnore
    private User createdBy;
    
    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ExamQuestion> questions = new ArrayList<>();
    
    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ExamAttempt> attempts = new ArrayList<>();
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Constructors
    public Exam() {}
    
    public Exam(String title, String description, Integer durationMinutes, 
                LocalDateTime startTime, LocalDateTime endTime, Integer totalMarks) {
        this.title = title;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalMarks = totalMarks;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getDurationMinutes() {
        return durationMinutes;
    }
    
    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
    
    public LocalDateTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalDateTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    
    public Integer getTotalMarks() {
        return totalMarks;
    }
    
    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }
    
    public Boolean getNegativeMarking() {
        return negativeMarking;
    }
    
    public void setNegativeMarking(Boolean negativeMarking) {
        this.negativeMarking = negativeMarking;
    }
    
    public Double getNegativeMarkingPercentage() {
        return negativeMarkingPercentage;
    }
    
    public void setNegativeMarkingPercentage(Double negativeMarkingPercentage) {
        this.negativeMarkingPercentage = negativeMarkingPercentage;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public com.epathshala.entity.Teacher getCourse() {
        return course;
    }
    
    public void setCourse(com.epathshala.entity.Teacher course) {
        this.course = course;
    }
    
    public User getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }
    
    public List<ExamQuestion> getQuestions() {
        return questions;
    }
    
    public void setQuestions(List<ExamQuestion> questions) {
        this.questions = questions;
    }
    
    public List<ExamAttempt> getAttempts() {
        return attempts;
    }
    
    public void setAttempts(List<ExamAttempt> attempts) {
        this.attempts = attempts;
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
    public boolean isCurrentlyActive() {
        return isActive; // Always active if isActive is true, ignore time
    }
    
    public boolean isUpcoming() {
        LocalDateTime now = LocalDateTime.now();
        return isActive && now.isBefore(startTime);
    }
    
    public boolean isCompleted() {
        LocalDateTime now = LocalDateTime.now();
        return now.isAfter(endTime);
    }
    
    public int getQuestionCount() {
        return questions.size();
    }
} 