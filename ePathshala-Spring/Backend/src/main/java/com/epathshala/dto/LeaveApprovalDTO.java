package com.epathshala.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveApprovalDTO {
    private Long leaveId;
    private String approverRole; // TEACHER or PARENT
    private String approvalStatus; // Approved or Rejected
}