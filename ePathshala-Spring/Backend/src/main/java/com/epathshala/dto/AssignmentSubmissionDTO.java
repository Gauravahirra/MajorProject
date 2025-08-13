package com.epathshala.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentSubmissionDTO {
    private Long id;
    private Long assignmentId;
    private Long studentId;
    private String studentName;
    private String submissionFileUrl;
    private String submissionText;
    private LocalDateTime submittedAt;
    private Double grade;
    private String feedback;
    private String status;
    private Boolean submittedLate;
    private String assignmentTitle;
    private String subject;
    private String className;
} 