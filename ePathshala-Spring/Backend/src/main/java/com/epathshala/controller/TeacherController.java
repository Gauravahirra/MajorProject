package com.epathshala.controller;

import com.epathshala.dto.AttendanceDTO;
import com.epathshala.dto.GradeDTO;
import com.epathshala.dto.AssignmentDTO;
import com.epathshala.dto.LeaveApprovalDTO;
import com.epathshala.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherController {
    @Autowired
    private TeacherService teacherService;

    @GetMapping("/students/{className}")
    public ResponseEntity<?> getStudentsByClass(@PathVariable String className) {
        try {
            return ResponseEntity.ok(teacherService.getStudentsByClass(className));
        } catch (Exception e) {
            System.out.println("Error in getStudentsByClass controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error fetching students"));
        }
    }

    @PostMapping("/attendance")
    public ResponseEntity<?> markAttendance(@RequestBody AttendanceDTO dto) {
        try {
            return ResponseEntity.ok(teacherService.markAttendance(dto));
        } catch (Exception e) {
            System.out.println("Error in markAttendance controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error marking attendance"));
        }
    }

    @GetMapping("/attendance/{className}")
    public ResponseEntity<?> getAttendanceByClass(@PathVariable String className) {
        try {
            return ResponseEntity.ok(teacherService.getAttendanceByClass(className));
        } catch (Exception e) {
            System.out.println("Error in getAttendanceByClass controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error fetching attendance"));
        }
    }

    @PostMapping("/grades")
    public ResponseEntity<?> enterGrade(@RequestBody GradeDTO dto) {
        try {
            return ResponseEntity.ok(teacherService.enterGrade(dto));
        } catch (Exception e) {
            System.out.println("Error in enterGrade controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error entering grade"));
        }
    }

    @GetMapping("/grades/{className}")
    public ResponseEntity<?> getGradesByClass(@PathVariable String className) {
        try {
            return ResponseEntity.ok(teacherService.getGradesByClass(className));
        } catch (Exception e) {
            System.out.println("Error in getGradesByClass controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error fetching grades"));
        }
    }

    @PostMapping("/assignments")
    public ResponseEntity<?> uploadAssignment(@RequestBody AssignmentDTO dto) {
        try {
            System.out.println("=== TeacherController.uploadAssignment called ===");
            System.out.println("Raw DTO received:");
            System.out.println("  Title: " + dto.getTitle());
            System.out.println("  Description: " + dto.getDescription());
            System.out.println("  FileUrl: " + dto.getFileUrl());
            System.out.println("  FileName: " + dto.getFileName());
            System.out.println("  FileSize: " + dto.getFileSize());
            System.out.println("  FileType: " + dto.getFileType());
            System.out.println("  DueDate: " + dto.getDueDate());
            System.out.println("  Subject: " + dto.getSubject());
            System.out.println("  ClassName: " + dto.getClassName());
            
            return ResponseEntity.ok(teacherService.uploadAssignment(dto));
        } catch (Exception e) {
            System.out.println("Error in uploadAssignment controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error uploading assignment"));
        }
    }

    @PostMapping("/assignments/upload")
    public ResponseEntity<?> uploadAssignmentFile(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "uploads/assignments";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String originalFilename = file.getOriginalFilename();
            String fileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(originalFilename != null ? originalFilename : "unknown");
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            // Return only the filename, not the full path
            return ResponseEntity.ok().body(fileName);
        } catch (Exception e) {
            System.out.println("Error in uploadAssignmentFile controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/assignments/{className}")
    public ResponseEntity<?> getAssignmentsByClass(@PathVariable String className) {
        try {
            return ResponseEntity.ok(teacherService.getAssignmentsByClass(className));
        } catch (Exception e) {
            System.out.println("Error in getAssignmentsByClass controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error fetching assignments"));
        }
    }

    @GetMapping("/leaves/{className}")
    public ResponseEntity<?> getLeavesByClass(@PathVariable String className) {
        try {
            return ResponseEntity.ok(teacherService.getLeavesByClass(className));
        } catch (Exception e) {
            System.out.println("Error in getLeavesByClass controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error fetching leave requests"));
        }
    }

    @PostMapping("/leave/approve")
    public ResponseEntity<?> approveLeave(@RequestBody LeaveApprovalDTO dto) {
        try {
            return ResponseEntity.ok(teacherService.approveLeave(dto));
        } catch (Exception e) {
            System.out.println("Error in approveLeave controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error approving leave"));
        }
    }
}