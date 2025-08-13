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
@RequestMapping("/api/teacher/online-classes")
@PreAuthorize("hasRole('TEACHER')")
@Tag(name = "Online Classes", description = "Online class management APIs")
public class OnlineClassController {
    
    @Autowired
    private OnlineClassService onlineClassService;
    
    @GetMapping
    @Operation(summary = "Get all online classes for a teacher")
    public ResponseEntity<List<OnlineClassDTO>> getClassesByTeacher(@RequestParam Long teacherId) {
        try {
            List<OnlineClassDTO> classes = onlineClassService.getAllClassesByTeacher(teacherId);
            return ResponseEntity.ok(classes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/active")
    @Operation(summary = "Get all active online classes")
    public ResponseEntity<List<OnlineClassDTO>> getActiveClasses() {
        try {
            List<OnlineClassDTO> classes = onlineClassService.getActiveClasses();
            return ResponseEntity.ok(classes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming online classes")
    public ResponseEntity<List<OnlineClassDTO>> getUpcomingClasses() {
        try {
            List<OnlineClassDTO> classes = onlineClassService.getUpcomingClasses();
            return ResponseEntity.ok(classes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping
    @Operation(summary = "Create a new online class")
    public ResponseEntity<OnlineClassDTO> createClass(@RequestBody OnlineClassDTO dto, @RequestParam Long teacherId) {
        try {
            OnlineClassDTO createdClass = onlineClassService.createClass(dto, teacherId);
            return ResponseEntity.ok(createdClass);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @PutMapping("/{classId}")
    @Operation(summary = "Update an online class")
    public ResponseEntity<OnlineClassDTO> updateClass(@PathVariable Long classId, @RequestBody OnlineClassDTO dto) {
        try {
            OnlineClassDTO updatedClass = onlineClassService.updateClass(classId, dto);
            return ResponseEntity.ok(updatedClass);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @DeleteMapping("/{classId}")
    @Operation(summary = "Delete an online class")
    public ResponseEntity<Map<String, String>> deleteClass(@PathVariable Long classId) {
        try {
            onlineClassService.deleteClass(classId);
            return ResponseEntity.ok(Map.of("message", "Class deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/{classId}/start")
    @Operation(summary = "Start an online class")
    public ResponseEntity<OnlineClassDTO> startClass(@PathVariable Long classId) {
        try {
            OnlineClassDTO startedClass = onlineClassService.startClass(classId);
            return ResponseEntity.ok(startedClass);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @PostMapping("/{classId}/end")
    @Operation(summary = "End an online class")
    public ResponseEntity<OnlineClassDTO> endClass(@PathVariable Long classId) {
        try {
            OnlineClassDTO endedClass = onlineClassService.endClass(classId);
            return ResponseEntity.ok(endedClass);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @GetMapping("/{classId}")
    @Operation(summary = "Get online class by ID")
    public ResponseEntity<OnlineClassDTO> getClassById(@PathVariable Long classId) {
        try {
            OnlineClassDTO onlineClass = onlineClassService.getClassById(classId);
            return ResponseEntity.ok(onlineClass);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/room/{roomId}")
    @Operation(summary = "Get online class by room ID")
    public ResponseEntity<OnlineClassDTO> getClassByRoomId(@PathVariable String roomId) {
        try {
            OnlineClassDTO onlineClass = onlineClassService.getClassByRoomId(roomId);
            return ResponseEntity.ok(onlineClass);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/join/{roomId}")
    @Operation(summary = "Join an online class")
    public ResponseEntity<OnlineClassDTO> joinClass(@PathVariable String roomId) {
        try {
            OnlineClassDTO joinedClass = onlineClassService.joinClass(roomId);
            return ResponseEntity.ok(joinedClass);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @PostMapping("/leave/{roomId}")
    @Operation(summary = "Leave an online class")
    public ResponseEntity<OnlineClassDTO> leaveClass(@PathVariable String roomId) {
        try {
            OnlineClassDTO leftClass = onlineClassService.leaveClass(roomId);
            return ResponseEntity.ok(leftClass);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
} 