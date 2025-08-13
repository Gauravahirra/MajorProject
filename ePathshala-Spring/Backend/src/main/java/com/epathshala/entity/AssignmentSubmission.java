package com.epathshala.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentSubmission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @Column(name = "submission_file_url")
    private String submissionFileUrl;
    
    @Column(name = "submission_text", columnDefinition = "TEXT")
    private String submissionText;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(name = "grade")
    private Double grade;
    
    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;
    
    @Column(name = "status")
    private String status; // submitted, graded, late
    
    @Column(name = "submitted_late")
    private Boolean submittedLate = false;
    
    // Constructor for new submissions
    public AssignmentSubmission(Assignment assignment, Student student, String submissionFileUrl, String submissionText) {
        this.assignment = assignment;
        this.student = student;
        this.submissionFileUrl = submissionFileUrl;
        this.submissionText = submissionText;
        this.submittedAt = LocalDateTime.now();
        this.status = "submitted";
        
        // Check if submitted late - handle null dueDate safely
        if (assignment.getDueDate() != null) {
            this.submittedLate = LocalDateTime.now().isAfter(assignment.getDueDate().atTime(23, 59, 59));
        } else {
            this.submittedLate = false;
        }
    }
} 