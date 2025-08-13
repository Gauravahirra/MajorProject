package com.epathshala.controller;

import com.epathshala.dto.ExamDTO;
import com.epathshala.dto.ExamQuestionDTO;
import com.epathshala.dto.ExamResultDTO;
import com.epathshala.service.ExamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import com.epathshala.repository.UserRepository;
import com.epathshala.entity.User;

@RestController
@RequestMapping("/api/faculty/exams")
@PreAuthorize("hasRole('TEACHER')")
@Tag(name = "Faculty Exam Management", description = "Faculty APIs for exam creation and management")
public class FacultyExamController {
    
    @Autowired
    private ExamService examService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping
    @Operation(summary = "Create Exam", description = "Create a new MCQ exam")
    public ResponseEntity<?> createExam(@Valid @RequestBody ExamDTO examDTO) {
        try {
            Long facultyId = getCurrentFacultyId();
            System.out.println("Faculty ID: " + facultyId); // Debug log
            System.out.println("Exam DTO: " + examDTO); // Debug log
            
            ExamDTO createdExam = examService.createExam(examDTO, facultyId);
            return ResponseEntity.ok(createdExam);
        } catch (Exception e) {
            System.err.println("Error in createExam: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to create exam", "message", e.getMessage()));
        }
    }
    
    @PostMapping("/{examId}/questions")
    @Operation(summary = "Add Questions", description = "Add questions to an existing exam")
    public ResponseEntity<ExamDTO> addQuestions(
            @PathVariable Long examId,
            @Valid @RequestBody List<ExamQuestionDTO> questions) {
        try {
            ExamDTO updatedExam = examService.addQuestions(examId, questions);
            return ResponseEntity.ok(updatedExam);
        } catch (Exception e) {
            System.err.println("Error in addQuestions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    @Operation(summary = "Get Faculty Exams", description = "Get all exams created by the faculty")
    public ResponseEntity<List<ExamDTO>> getFacultyExams() {
        try {
            Long facultyId = getCurrentFacultyId();
            System.out.println("Faculty ID: " + facultyId); // Debug log
            List<ExamDTO> exams = examService.getExamsByFaculty(facultyId);
            System.out.println("Found " + (exams != null ? exams.size() : 0) + " exams"); // Debug log
            return ResponseEntity.ok(exams != null ? exams : List.of());
        } catch (Exception e) {
            System.err.println("Error in getFacultyExams: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{examId}")
    @Operation(summary = "Get Exam Details", description = "Get detailed information about an exam")
    public ResponseEntity<ExamDTO> getExamDetails(@PathVariable Long examId) {
        try {
            ExamDTO exam = examService.getExamById(examId);
            return ResponseEntity.ok(exam);
        } catch (Exception e) {
            System.err.println("Error in getExamDetails: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{examId}/results")
    @Operation(summary = "Get Exam Results", description = "Get all student results for an exam")
    public ResponseEntity<List<ExamResultDTO>> getExamResults(@PathVariable Long examId) {
        try {
            List<ExamResultDTO> results = examService.getExamResults(examId);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("Error in getExamResults: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PutMapping("/{examId}/activate")
    @Operation(summary = "Activate Exam", description = "Activate an exam to make it available to students")
    public ResponseEntity<ExamDTO> activateExam(@PathVariable Long examId) {
        try {
            ExamDTO activatedExam = examService.activateExam(examId);
            return ResponseEntity.ok(activatedExam);
        } catch (Exception e) {
            System.err.println("Error in activateExam: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{examId}/deactivate")
    @Operation(summary = "Deactivate Exam", description = "Deactivate an exam to prevent further attempts")
    public ResponseEntity<ExamDTO> deactivateExam(@PathVariable Long examId) {
        try {
            ExamDTO deactivatedExam = examService.deactivateExam(examId);
            return ResponseEntity.ok(deactivatedExam);
        } catch (Exception e) {
            System.err.println("Error in deactivateExam: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{examId}")
    @Operation(summary = "Delete Exam", description = "Delete an exam (only if no attempts have been made)")
    public ResponseEntity<?> deleteExam(@PathVariable Long examId) {
        try {
            examService.deleteExam(examId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error in deleteExam: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/health")
    @Operation(summary = "Health Check", description = "Simple health check endpoint")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        try {
            Long facultyId = getCurrentFacultyId();
            return ResponseEntity.ok(Map.of(
                "status", "healthy",
                "facultyId", facultyId,
                "timestamp", System.currentTimeMillis()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "status", "error",
                "message", e.getMessage(),
                "timestamp", System.currentTimeMillis()
            ));
        }
    }
    
    // Helper method to get current faculty ID from security context
    private Long getCurrentFacultyId() {
        try {
            String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getName();
            
            System.out.println("Current faculty email: " + currentUserEmail); // Debug log
            
            com.epathshala.entity.User user = userRepository.findByEmail(currentUserEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            System.out.println("Found faculty user ID: " + user.getId()); // Debug log
            return user.getId();
        } catch (Exception e) {
            System.err.println("Error getting current faculty ID: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Unable to get current faculty ID", e);
        }
    }
} 