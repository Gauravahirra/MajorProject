package com.epathshala.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestDTO {
    private Long studentId;
    private String reason;
    private LocalDate fromDate;
    private LocalDate toDate;
}