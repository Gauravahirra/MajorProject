package com.epathshala.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

public class ParentDashboardDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttendanceResponseDTO {
        private Long id;
        private LocalDate date;
        private String status;
        private String studentName;
        private String className;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GradeResponseDTO {
        private Long id;
        private String subject;
        private Double marks;
        private String teacherName;
        private String studentName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LeaveRequestResponseDTO {
        private Long id;
        private String reason;
        private LocalDate fromDate;
        private LocalDate toDate;
        private String teacherApproval;
        private String parentApproval;
        private String status;
        private String studentName;
    }
} 