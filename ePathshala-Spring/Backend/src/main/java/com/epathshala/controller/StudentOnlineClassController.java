package com.epathshala.controller;

import com.epathshala.dto.OnlineClassDTO;
import com.epathshala.service.OnlineClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student/online-classes")
@PreAuthorize("hasRole('STUDENT')")
@Tag(name = "Student Online Classes", description = "Student online class access APIs")
public class StudentOnlineClassController {
    
    @Autowired
    private OnlineClassService onlineClassService;
    
    @GetMapping("/available")
    @Operation(summary = "Get all available online classes for students")
    public ResponseEntity<List<OnlineClassDTO>> getAvailableClasses() {
        try {
            // Return all classes (active, scheduled, completed) so students can see everything
            List<OnlineClassDTO> classes = onlineClassService.getAllClasses();
            return ResponseEntity.ok(classes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/room/{roomId}")
    @Operation(summary = "Get online class by room ID for students")
    public ResponseEntity<OnlineClassDTO> getClassByRoomId(@PathVariable String roomId) {
        try {
            OnlineClassDTO onlineClass = onlineClassService.getClassByRoomId(roomId);
            return ResponseEntity.ok(onlineClass);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/join/{roomId}")
    @Operation(summary = "Join an online class by room ID")
    public ResponseEntity<Map<String, String>> joinClass(@PathVariable String roomId) {
        try {
            // For now, just return success - in a real implementation, you might track participants
            return ResponseEntity.ok(Map.of("message", "Successfully joined class", "roomId", roomId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/leave/{roomId}")
    @Operation(summary = "Leave an online class")
    public ResponseEntity<Map<String, String>> leaveClass(@PathVariable String roomId) {
        try {
            // For now, just return success - in a real implementation, you might track participants
            return ResponseEntity.ok(Map.of("message", "Successfully left class", "roomId", roomId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 