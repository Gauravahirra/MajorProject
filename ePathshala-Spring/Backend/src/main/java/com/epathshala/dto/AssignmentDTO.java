package com.epathshala.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentDTO {
    private Long id;
    private String title;
    private String description;
    private String fileUrl;
    private LocalDate dueDate;
    private String subject;
    private String className;
    private String fileName;
    private Long fileSize;
    private String fileType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String teacherName;
    private Long teacherId;
    private Integer submissionCount;
    private Boolean hasSubmission;
}