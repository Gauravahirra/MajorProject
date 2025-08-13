package com.epathshala.controller;

import com.epathshala.dto.AssignmentDTO;
import com.epathshala.dto.AssignmentSubmissionDTO;
import com.epathshala.service.AssignmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
@Tag(name = "Assignments", description = "Assignment management APIs")
public class AssignmentController {
    
    @Autowired
    private AssignmentService assignmentService;
    
    // Create assignment (Teacher only)
    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Create new assignment", description = "Create a new assignment with optional file upload")
    public ResponseEntity<AssignmentDTO> createAssignment(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("dueDate") String dueDate,
            @RequestParam("subject") String subject,
            @RequestParam("className") String className,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("teacherId") Long teacherId) throws IOException {
        
        System.out.println("=== AssignmentController.createAssignment called ===");
        System.out.println("Title: " + title);
        System.out.println("Description: " + description);
        System.out.println("DueDate: " + dueDate);
        System.out.println("Subject: " + subject);
        System.out.println("ClassName: " + className);
        System.out.println("TeacherId: " + teacherId);
        System.out.println("File: " + (file != null ? file.getOriginalFilename() : "null"));
        
        AssignmentDTO dto = new AssignmentDTO();
        dto.setTitle(title);
        dto.setDescription(description);
        dto.setDueDate(java.time.LocalDate.parse(dueDate));
        dto.setSubject(subject);
        dto.setClassName(className);
        
        AssignmentDTO createdAssignment = assignmentService.createAssignment(dto, file, teacherId);
        return ResponseEntity.ok(createdAssignment);
    }
    
    // Get assignment by ID
    @GetMapping("/{id}")
    @Operation(summary = "Get assignment by ID", description = "Get assignment details by ID")
    public ResponseEntity<AssignmentDTO> getAssignmentById(@PathVariable Long id) {
        AssignmentDTO assignment = assignmentService.getAssignmentById(id);
        return ResponseEntity.ok(assignment);
    }
    
    // Get assignments by class
    @GetMapping("/class/{className}")
    @Operation(summary = "Get assignments by class", description = "Get all assignments for a specific class")
    public ResponseEntity<List<AssignmentDTO>> getAssignmentsByClass(@PathVariable String className) {
        List<AssignmentDTO> assignments = assignmentService.getAssignmentsByClass(className);
        return ResponseEntity.ok(assignments);
    }
    
    // Download assignment file
    @GetMapping("/download/{filename}")
    @Operation(summary = "Download assignment file", description = "Download assignment file by filename")
    public ResponseEntity<Resource> downloadAssignmentFile(@PathVariable String filename) {
        try {
            Resource resource = assignmentService.downloadAssignmentFile(filename);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Submit assignment (Student only)
    @PostMapping("/{assignmentId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Submit assignment", description = "Submit assignment with optional file upload")
    public ResponseEntity<AssignmentSubmissionDTO> submitAssignment(
            @PathVariable Long assignmentId,
            @RequestParam("studentId") Long studentId,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "submissionText", required = false) String submissionText) {
        
        try {
            // Validate inputs
            if (submissionText == null || submissionText.trim().isEmpty()) {
                if (file == null || file.isEmpty()) {
                    return ResponseEntity.badRequest().build();
                }
            }
            
            AssignmentSubmissionDTO submission = assignmentService.submitAssignment(assignmentId, studentId, file, submissionText);
            return ResponseEntity.ok(submission);
        } catch (RuntimeException e) {
            System.err.println("Error submitting assignment: " + e.getMessage());
            e.printStackTrace();
            
            // Handle specific error cases
            if (e.getMessage().contains("Assignment already submitted")) {
                return ResponseEntity.status(409).build(); // 409 Conflict
            } else if (e.getMessage().contains("Assignment not found")) {
                return ResponseEntity.status(404).build(); // 404 Not Found
            } else if (e.getMessage().contains("Student not found")) {
                return ResponseEntity.status(404).build(); // 404 Not Found
            }
            
            return ResponseEntity.status(500).build();
        } catch (IOException e) {
            System.err.println("File upload error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    // Check if student has submitted
    @GetMapping("/{assignmentId}/submitted/{studentId}")
    @Operation(summary = "Check submission status", description = "Check if a student has submitted an assignment")
    public ResponseEntity<Map<String, Boolean>> hasStudentSubmitted(
            @PathVariable Long assignmentId,
            @PathVariable Long studentId) {
        
        Boolean hasSubmitted = assignmentService.hasStudentSubmitted(assignmentId, studentId);
        return ResponseEntity.ok(Map.of("hasSubmitted", hasSubmitted));
    }
    
    // Get submissions by assignment (Teacher only)
    @GetMapping("/{assignmentId}/submissions")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Get submissions by assignment", description = "Get all submissions for a specific assignment")
    public ResponseEntity<List<AssignmentSubmissionDTO>> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        List<AssignmentSubmissionDTO> submissions = assignmentService.getSubmissionsByAssignment(assignmentId);
        return ResponseEntity.ok(submissions);
    }
    
    // Get submissions by student (Student only)
    @GetMapping("/student/{studentId}/submissions")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get submissions by student", description = "Get all submissions by a specific student")
    public ResponseEntity<List<AssignmentSubmissionDTO>> getSubmissionsByStudent(@PathVariable Long studentId) {
        List<AssignmentSubmissionDTO> submissions = assignmentService.getSubmissionsByStudent(studentId);
        return ResponseEntity.ok(submissions);
    }
    
    // Grade submission (Teacher only)
    @PostMapping("/submissions/{submissionId}/grade")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Grade submission", description = "Grade an assignment submission with feedback")
    public ResponseEntity<AssignmentSubmissionDTO> gradeSubmission(
            @PathVariable Long submissionId,
            @RequestParam("grade") Double grade,
            @RequestParam("feedback") String feedback) {
        
        AssignmentSubmissionDTO gradedSubmission = assignmentService.gradeSubmission(submissionId, grade, feedback);
        return ResponseEntity.ok(gradedSubmission);
    }
    
    // Download submission file
    @GetMapping("/submissions/download/{filename}")
    @Operation(summary = "Download submission file", description = "Download submission file by filename")
    public ResponseEntity<Resource> downloadSubmissionFile(@PathVariable String filename) {
        try {
            Resource resource = assignmentService.downloadSubmissionFile(filename);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Get submission statistics (Teacher only)
    @GetMapping("/{assignmentId}/stats")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Get submission statistics", description = "Get submission statistics for an assignment")
    public ResponseEntity<Map<String, Object>> getSubmissionStats(@PathVariable Long assignmentId) {
        Map<String, Object> stats = assignmentService.getSubmissionStats(assignmentId);
        return ResponseEntity.ok(stats);
    }
    
    // Get assignments by teacher
    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Get assignments by teacher", description = "Get all assignments created by a teacher")
    public ResponseEntity<List<AssignmentDTO>> getAssignmentsByTeacher(@PathVariable Long teacherId) {
        List<AssignmentDTO> assignments = assignmentService.getAssignmentsByTeacher(teacherId);
        return ResponseEntity.ok(assignments);
    }
    
    // Get all assignments
    @GetMapping
    @Operation(summary = "Get all assignments", description = "Get all assignments in the system")
    public ResponseEntity<List<AssignmentDTO>> getAllAssignments() {
        List<AssignmentDTO> assignments = assignmentService.getAllAssignments();
        return ResponseEntity.ok(assignments);
    }
} 