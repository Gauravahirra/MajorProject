package com.epathshala.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

public class TeacherDashboardDTO {
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttendanceResponseDTO {
        private Long id;
        private Long studentId;
        private String studentName;
        private LocalDate date;
        private String status;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GradeResponseDTO {
        private Long id;
        private Long studentId;
        private String studentName;
        private String subject;
        private Double marks;
        private String remarks;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignmentResponseDTO {
        private Long id;
        private String title;
        private String fileUrl;
        private LocalDate dueDate;
        private String subject;
        private String className;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LeaveRequestResponseDTO {
        private Long id;
        private Long studentId;
        private String studentName;
        private String reason;
        private LocalDate fromDate;
        private LocalDate toDate;
        private String teacherApproval;
        private String parentApproval;
        private String status;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentResponseDTO {
        private Long id;
        private String name;
        private String email;
        private String studentClass;
    }
} 