package com.epathshala.controller;

import com.epathshala.dto.ExamDTO;
import com.epathshala.dto.ExamResultDTO;
import com.epathshala.service.ExamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import com.epathshala.repository.UserRepository;
import com.epathshala.entity.User;
import com.epathshala.repository.StudentRepository;
import com.epathshala.entity.Student;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/student/exams")
@PreAuthorize("hasRole('STUDENT')")
@Tag(name = "Student Exam Participation", description = "Student APIs for exam participation and results")
public class StudentExamController {
    
    @Autowired
    private ExamService examService;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;
    
    @GetMapping("/available")
    @Operation(summary = "Get Available Exams", description = "Get all available exams for the student")
    public ResponseEntity<List<ExamDTO>> getAvailableExams() {
        try {
            Long studentId = getCurrentStudentId();
            System.out.println("Student ID: " + studentId); // Debug log
            
            if (studentId == null) {
                System.err.println("Student ID is null!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.emptyList());
            }
            
            List<ExamDTO> exams = examService.getAvailableExams(studentId);
            System.out.println("Found " + (exams != null ? exams.size() : 0) + " exams"); // Debug log
            return ResponseEntity.ok(exams != null ? exams : Collections.emptyList());
        } catch (Exception e) {
            System.err.println("Error in getAvailableExams: " + e.getMessage());
            e.printStackTrace(); // Print full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }
    
    @PostMapping("/{examId}/start")
    @Operation(summary = "Start Exam", description = "Start an exam and create an attempt")
    public ResponseEntity<?> startExam(@PathVariable Long examId) {
        try {
            Long studentId = getCurrentStudentId();
            ExamDTO exam = examService.startExam(examId, studentId);
            return ResponseEntity.ok(exam);
        } catch (RuntimeException e) {
            System.err.println("Error in startExam: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error in startExam: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Internal server error"));
        }
    }
    
    @PostMapping("/{examId}/submit")
    @Operation(summary = "Submit Exam", description = "Submit exam answers and get results")
    public ResponseEntity<ExamResultDTO> submitExam(
            @PathVariable Long examId,
            @RequestBody Map<Long, String> answers) {
        try {
            Long studentId = getCurrentStudentId();
            ExamResultDTO result = examService.submitExam(examId, studentId, answers);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error in submitExam: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @GetMapping("/{examId}/result")
    @Operation(summary = "Get Exam Result", description = "Get detailed result with performance charts")
    public ResponseEntity<ExamResultDTO> getExamResult(@PathVariable Long examId) {
        try {
            Long studentId = getCurrentStudentId();
            ExamResultDTO result = examService.getExamResult(examId, studentId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error in getExamResult: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/history")
    @Operation(summary = "Get Exam History", description = "Get all exam attempts by the student")
    public ResponseEntity<List<ExamResultDTO>> getExamHistory() {
        try {
            Long studentId = getCurrentStudentId();
            List<ExamResultDTO> history = examService.getExamHistory(studentId);
            return ResponseEntity.ok(history != null ? history : new ArrayList<>());
        } catch (Exception e) {
            System.err.println("Error in getExamHistory: " + e.getMessage());
            e.printStackTrace();
            // Return empty list instead of 500 error
            return ResponseEntity.ok(new ArrayList<>());
        }
    }
    
    @GetMapping("/{examId}/questions")
    @Operation(summary = "Get Exam Questions", description = "Get questions for an active exam")
    public ResponseEntity<ExamDTO> getExamQuestions(@PathVariable Long examId) {
        try {
            Long studentId = getCurrentStudentId();
            ExamDTO exam = examService.getExamById(examId);
            return ResponseEntity.ok(exam);
        } catch (Exception e) {
            System.err.println("Error in getExamQuestions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{examId}/timer")
    @Operation(summary = "Get Exam Timer", description = "Get remaining time for an active exam")
    public ResponseEntity<Map<String, Object>> getExamTimer(@PathVariable Long examId) {
        try {
            Long studentId = getCurrentStudentId();
            Map<String, Object> timer = examService.getExamTimer(examId, studentId);
            return ResponseEntity.ok(timer);
        } catch (Exception e) {
            System.err.println("Error in getExamTimer: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Helper method to get current student ID from security context
    private Long getCurrentStudentId() {
        try {
            // Get current user from security context
            String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getName();
            
            System.out.println("Current user email: " + currentUserEmail); // Debug log
            
            // Find user by email
            com.epathshala.entity.User user = userRepository.findByEmail(currentUserEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            System.out.println("Found user ID: " + user.getId()); // Debug log
            
            // Find student by user ID
            com.epathshala.entity.Student student = studentRepository.findByUser_Id(user.getId())
                    .orElseThrow(() -> new RuntimeException("Student not found for user ID: " + user.getId()));
            
            System.out.println("Found student ID: " + student.getId()); // Debug log
            return student.getId();
        } catch (Exception e) {
            System.err.println("Error getting current student ID: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Unable to get current student ID", e);
        }
    }
} 