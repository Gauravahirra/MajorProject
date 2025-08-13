package com.epathshala.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exam_attempts")
@EntityListeners(AuditingEntityListener.class)
public class ExamAttempt {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    @JsonIgnore
    private Exam exam;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnore
    private Student student;
    
    @NotNull
    @Column(nullable = false)
    private LocalDateTime startTime;
    
    @Column
    private LocalDateTime endTime;
    
    @Column(nullable = false)
    private Integer totalQuestions;
    
    @Column(nullable = false)
    private Integer answeredQuestions = 0;
    
    @Column(nullable = false)
    private Integer correctAnswers = 0;
    
    @Column(nullable = false)
    private Integer incorrectAnswers = 0;
    
    @Column(nullable = false)
    private Integer totalMarks = 0;
    
    @Column(nullable = false)
    private Integer obtainedMarks = 0;
    
    @Column(nullable = false)
    private Double percentage = 0.0;
    
    @Column(nullable = false)
    private String status = "IN_PROGRESS"; // IN_PROGRESS, COMPLETED, TIMEOUT
    
    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ExamAnswer> answers = new ArrayList<>();
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Constructors
    public ExamAttempt() {}
    
    public ExamAttempt(Exam exam, Student student) {
        this.exam = exam;
        this.student = student;
        this.startTime = LocalDateTime.now();
        this.totalQuestions = exam.getQuestionCount();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Exam getExam() {
        return exam;
    }
    
    public void setExam(Exam exam) {
        this.exam = exam;
    }
    
    public Student getStudent() {
        return student;
    }
    
    public void setStudent(Student student) {
        this.student = student;
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
    
    public Integer getTotalQuestions() {
        return totalQuestions;
    }
    
    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }
    
    public Integer getAnsweredQuestions() {
        return answeredQuestions;
    }
    
    public void setAnsweredQuestions(Integer answeredQuestions) {
        this.answeredQuestions = answeredQuestions;
    }
    
    public Integer getCorrectAnswers() {
        return correctAnswers;
    }
    
    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }
    
    public Integer getIncorrectAnswers() {
        return incorrectAnswers;
    }
    
    public void setIncorrectAnswers(Integer incorrectAnswers) {
        this.incorrectAnswers = incorrectAnswers;
    }
    
    public Integer getTotalMarks() {
        return totalMarks;
    }
    
    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }
    
    public Integer getObtainedMarks() {
        return obtainedMarks;
    }
    
    public void setObtainedMarks(Integer obtainedMarks) {
        this.obtainedMarks = obtainedMarks;
    }
    
    public Double getPercentage() {
        return percentage;
    }
    
    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public List<ExamAnswer> getAnswers() {
        return answers;
    }
    
    public void setAnswers(List<ExamAnswer> answers) {
        this.answers = answers;
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
    public boolean isCompleted() {
        return "COMPLETED".equals(status) || "TIMEOUT".equals(status);
    }
    
    public boolean isInProgress() {
        return "IN_PROGRESS".equals(status);
    }
    
    public long getDurationInMinutes() {
        if (endTime == null) {
            return java.time.Duration.between(startTime, LocalDateTime.now()).toMinutes();
        }
        return java.time.Duration.between(startTime, endTime).toMinutes();
    }
    
    public void calculateResults() {
        this.answeredQuestions = answers.size();
        this.correctAnswers = (int) answers.stream()
                .filter(answer -> answer.getQuestion().isCorrectAnswer(answer.getSelectedAnswer()))
                .count();
        this.incorrectAnswers = answeredQuestions - correctAnswers;
        
        // Calculate marks with negative marking
        this.obtainedMarks = answers.stream()
                .mapToInt(answer -> {
                    if (answer.getQuestion().isCorrectAnswer(answer.getSelectedAnswer())) {
                        return answer.getQuestion().getMarks();
                    } else if (exam.getNegativeMarking()) {
                        return (int) (-answer.getQuestion().getMarks() * exam.getNegativeMarkingPercentage() / 100.0);
                    }
                    return 0;
                })
                .sum();
        
        this.percentage = totalMarks > 0 ? (obtainedMarks * 100.0) / totalMarks : 0.0;
    }
} 