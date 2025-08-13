package com.epathshala.controller;

import com.epathshala.dto.UserDTO;
import com.epathshala.service.AdminService;
import com.epathshala.service.OnlineClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.epathshala.dto.AcademicCalendarDTO;
import com.epathshala.entity.Exam;
import com.epathshala.entity.ExamQuestion;
import com.epathshala.repository.ExamQuestionRepository;
import com.epathshala.repository.ExamRepository;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Management", description = "Admin-specific APIs for user and system management")
public class AdminController {
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private OnlineClassService onlineClassService;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ExamQuestionRepository examQuestionRepository;

    @PostMapping("/add-student")
    @Operation(summary = "Add Student", description = "Create a new student account")
    public ResponseEntity<?> addStudent(@RequestBody UserDTO dto) {
        return ResponseEntity.ok(adminService.addStudent(dto));
    }

    @PostMapping("/add-teacher")
    @Operation(summary = "Add Teacher", description = "Create a new teacher account")
    public ResponseEntity<?> addTeacher(@RequestBody UserDTO dto) {
        return ResponseEntity.ok(adminService.addTeacher(dto));
    }

    @PostMapping("/add-parent")
    @Operation(summary = "Add Parent", description = "Create a new parent account")
    public ResponseEntity<?> addParent(@RequestBody UserDTO dto) {
        return ResponseEntity.ok(adminService.addParent(dto));
    }

    @GetMapping("/students")
    @Operation(summary = "Get All Students", description = "Retrieve all student accounts")
    public ResponseEntity<?> getAllStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    @GetMapping("/teachers")
    @Operation(summary = "Get All Teachers", description = "Retrieve all teacher accounts")
    public ResponseEntity<?> getAllTeachers() {
        return ResponseEntity.ok(adminService.getAllTeachers());
    }

    @GetMapping("/parents")
    @Operation(summary = "Get All Parents", description = "Retrieve all parent accounts")
    public ResponseEntity<?> getAllParents() {
        return ResponseEntity.ok(adminService.getAllParents());
    }

    @DeleteMapping("/user/{id}")
    @Operation(summary = "Delete User", description = "Delete a user account by ID")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/assign-teacher")
    @Operation(summary = "Assign Teacher", description = "Assign a teacher to a class")
    public ResponseEntity<?> assignTeacher(@RequestBody UserDTO dto) {
        return ResponseEntity.ok(adminService.assignTeacher(dto));
    }

    @PostMapping("/calendar")
    @Operation(summary = "Add Calendar Event", description = "Add a new academic calendar event")
    public ResponseEntity<?> addEvent(@RequestBody AcademicCalendarDTO dto) {
        return ResponseEntity.ok(adminService.addEvent(dto));
    }

    @GetMapping("/calendar")
    @Operation(summary = "Get Calendar Events", description = "Retrieve all academic calendar events")
    public ResponseEntity<?> getEvents() {
        return ResponseEntity.ok(adminService.getEvents());
    }

    @DeleteMapping("/calendar/{eventId}")
    @Operation(summary = "Delete Calendar Event", description = "Delete an academic calendar event by ID")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId) {
        adminService.deleteEvent(eventId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/dashboard-summary")
    @Operation(summary = "Get Dashboard Summary", description = "Get admin dashboard statistics and summary")
    public ResponseEntity<?> getDashboardSummary() {
        return ResponseEntity.ok(adminService.getDashboardSummary());
    }

    @GetMapping("/online-classes")
    @Operation(summary = "Get All Online Classes", description = "Retrieve all online classes across the system")
    public ResponseEntity<?> getAllOnlineClasses() {
        return ResponseEntity.ok(onlineClassService.getAllClasses());
    }

    @PostMapping("/add-sample-questions/{examId}")
    @Operation(summary = "Add Sample Questions", description = "Add sample questions to an exam for testing")
    public ResponseEntity<String> addSampleQuestions(@PathVariable Long examId) {
        try {
            // Check if exam exists
            Exam exam = examRepository.findById(examId)
                    .orElseThrow(() -> new RuntimeException("Exam not found"));
            
            // Add sample questions
            List<ExamQuestion> questions = Arrays.asList(
                new ExamQuestion("What is the output of: System.out.println(10 + 20)?", "30", "1020", "Error", "None of the above", "A", 5, "Easy", "Operators"),
                new ExamQuestion("Which keyword is used to create a class in Java?", "class", "new", "create", "define", "A", 5, "Easy", "Classes"),
                new ExamQuestion("What is the correct way to declare a variable in Java?", "int x = 5;", "variable x = 5;", "x = 5;", "declare x = 5;", "A", 5, "Easy", "Variables"),
                new ExamQuestion("Which of the following is NOT a primitive data type in Java?", "int", "String", "boolean", "double", "B", 5, "Medium", "Data Types"),
                new ExamQuestion("What is the purpose of the \"public\" keyword in Java?", "To make a method private", "To make a method accessible from anywhere", "To make a method protected", "To make a method static", "B", 5, "Medium", "Access Modifiers")
            );
            
            for (ExamQuestion question : questions) {
                question.setExam(exam);
                examQuestionRepository.save(question);
            }
            
            return ResponseEntity.ok("Added " + questions.size() + " sample questions to exam " + examId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}