package com.epathshala.controller;

import com.epathshala.service.StudentService;
import com.epathshala.repository.StudentRepository;
import com.epathshala.entity.Student;
import com.epathshala.entity.User;
import com.epathshala.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.epathshala.dto.LeaveRequestDTO;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/test-db")
    public ResponseEntity<?> testDatabase() {
        long userCount = userRepository.count();
        long studentCount = studentRepository.count();
        
        return ResponseEntity.ok(Map.of(
            "message", "Database test",
            "totalUsers", userCount,
            "totalStudents", studentCount,
            "timestamp", System.currentTimeMillis()
        ));
    }

    @GetMapping("/test-auth")
    public ResponseEntity<?> testAuth() {
        return ResponseEntity.ok(Map.of(
            "message", "Authentication working!",
            "timestamp", System.currentTimeMillis()
        ));
    }

    @GetMapping("/debug/database")
    public ResponseEntity<?> debugDatabase() {
        List<Student> allStudents = studentRepository.findAll();
        Map<String, Object> debugInfo = Map.of(
            "totalStudents", allStudents.size(),
            "students", allStudents.stream().map(s -> Map.of(
                "id", s.getId(),
                "name", s.getUser().getName(),
                "email", s.getUser().getEmail(),
                "class", s.getStudentClass(),
                "userId", s.getUser().getId()
            )).toList()
        );
        return ResponseEntity.ok(debugInfo);
    }

    @GetMapping("/details/{userId}")
    public ResponseEntity<?> getStudentDetails(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        Student student = studentRepository.findAll().stream()
            .filter(s -> s.getUser().getId().equals(userId))
            .findFirst()
            .orElse(null);
            
        if (student == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(Map.of(
            "id", student.getId(),
            "name", student.getUser().getName(),
            "email", student.getUser().getEmail(),
            "studentClass", student.getStudentClass(),
            "userId", student.getUser().getId()
        ));
    }

    @GetMapping("/attendance/{userId}")
    public ResponseEntity<?> getAttendance(@PathVariable Long userId) {
        return ResponseEntity.ok(studentService.getAttendance(userId));
    }

    @GetMapping("/grades/{userId}")
    public ResponseEntity<?> getGrades(@PathVariable Long userId) {
        return ResponseEntity.ok(studentService.getGrades(userId));
    }

    @GetMapping("/assignments/{className}")
    public ResponseEntity<?> getAssignments(@PathVariable String className) {
        return ResponseEntity.ok(studentService.getAssignmentsByClass(className));
    }

    @PostMapping("/leave")
    public ResponseEntity<?> submitLeave(@RequestBody LeaveRequestDTO dto) {
        return ResponseEntity.ok(studentService.submitLeave(dto));
    }

    @GetMapping("/leave/{userId}")
    public ResponseEntity<?> getLeaveStatus(@PathVariable Long userId) {
        return ResponseEntity.ok(studentService.getLeaveStatus(userId));
    }
}