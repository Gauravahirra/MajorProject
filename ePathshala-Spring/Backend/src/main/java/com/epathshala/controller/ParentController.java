package com.epathshala.controller;

import com.epathshala.service.ParentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.epathshala.dto.LeaveApprovalDTO;

import java.util.Map;

@RestController
@RequestMapping("/api/parent")
@PreAuthorize("hasRole('PARENT')")
public class ParentController {
    @Autowired
    private ParentService parentService;

    @GetMapping("/attendance/{userId}")
    public ResponseEntity<?> getChildAttendance(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(parentService.getChildAttendance(userId));
        } catch (Exception e) {
            System.out.println("Error in getChildAttendance controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error fetching attendance"));
        }
    }

    @GetMapping("/grades/{userId}")
    public ResponseEntity<?> getChildGrades(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(parentService.getChildGrades(userId));
        } catch (Exception e) {
            System.out.println("Error in getChildGrades controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error fetching grades"));
        }
    }

    @GetMapping("/leave/{userId}")
    public ResponseEntity<?> getChildLeaveStatus(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(parentService.getChildLeaveStatus(userId));
        } catch (Exception e) {
            System.out.println("Error in getChildLeaveStatus controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error fetching leave status"));
        }
    }

    @PostMapping("/leave/approve")
    public ResponseEntity<?> approveLeave(@RequestBody LeaveApprovalDTO dto) {
        try {
            return ResponseEntity.ok(parentService.approveLeave(dto));
        } catch (Exception e) {
            System.out.println("Error in approveLeave controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error approving leave"));
        }
    }
}