package com.epathshala.service;

import com.epathshala.dto.OnlineClassDTO;
import com.epathshala.entity.OnlineClass;
import com.epathshala.entity.Teacher;
import com.epathshala.repository.OnlineClassRepository;
import com.epathshala.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OnlineClassService {
    
    @Autowired
    private OnlineClassRepository onlineClassRepository;
    
    @Autowired
    private TeacherRepository teacherRepository;
    
    public List<OnlineClassDTO> getAllClassesByTeacher(Long teacherId) {
        List<OnlineClass> classes = onlineClassRepository.findByTeacherIdOrderByScheduledTimeDesc(teacherId);
        return classes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<OnlineClassDTO> getActiveClasses() {
        List<OnlineClass> classes = onlineClassRepository.findActiveClasses();
        return classes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<OnlineClassDTO> getAllClasses() {
        List<OnlineClass> classes = onlineClassRepository.findAllByOrderByScheduledTimeDesc();
        return classes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<OnlineClassDTO> getUpcomingClasses() {
        List<OnlineClass> classes = onlineClassRepository.findUpcomingClasses(LocalDateTime.now());
        return classes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public OnlineClassDTO createClass(OnlineClassDTO dto, Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        
        OnlineClass onlineClass = new OnlineClass(
            dto.getTitle(),
            dto.getSubject(),
            dto.getDescription(),
            dto.getScheduledTime(),
            dto.getDuration(),
            dto.getMaxParticipants(),
            teacher
        );
        
        OnlineClass savedClass = onlineClassRepository.save(onlineClass);
        return convertToDTO(savedClass);
    }
    
    public OnlineClassDTO updateClass(Long classId, OnlineClassDTO dto) {
        OnlineClass onlineClass = onlineClassRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Online class not found"));
        
        onlineClass.setTitle(dto.getTitle());
        onlineClass.setSubject(dto.getSubject());
        onlineClass.setDescription(dto.getDescription());
        onlineClass.setScheduledTime(dto.getScheduledTime());
        onlineClass.setDuration(dto.getDuration());
        onlineClass.setMaxParticipants(dto.getMaxParticipants());
        
        OnlineClass updatedClass = onlineClassRepository.save(onlineClass);
        return convertToDTO(updatedClass);
    }
    
    public void deleteClass(Long classId) {
        OnlineClass onlineClass = onlineClassRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Online class not found"));
        
        onlineClassRepository.delete(onlineClass);
    }
    
    public OnlineClassDTO startClass(Long classId) {
        OnlineClass onlineClass = onlineClassRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Online class not found"));
        
        if (!"scheduled".equals(onlineClass.getStatus())) {
            throw new RuntimeException("Class is not in scheduled status");
        }
        
        onlineClass.setStatus("active");
        OnlineClass updatedClass = onlineClassRepository.save(onlineClass);
        return convertToDTO(updatedClass);
    }
    
    public OnlineClassDTO endClass(Long classId) {
        OnlineClass onlineClass = onlineClassRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Online class not found"));
        
        if (!"active".equals(onlineClass.getStatus())) {
            throw new RuntimeException("Class is not active");
        }
        
        onlineClass.setStatus("completed");
        OnlineClass updatedClass = onlineClassRepository.save(onlineClass);
        return convertToDTO(updatedClass);
    }
    
    public OnlineClassDTO joinClass(String roomId) {
        OnlineClass onlineClass = onlineClassRepository.findByRoomId(roomId);
        if (onlineClass == null) {
            throw new RuntimeException("Class not found");
        }
        
        if (!"active".equals(onlineClass.getStatus())) {
            throw new RuntimeException("Class is not active");
        }
        
        if (onlineClass.getCurrentParticipants() >= onlineClass.getMaxParticipants()) {
            throw new RuntimeException("Class is full");
        }
        
        onlineClass.setCurrentParticipants(onlineClass.getCurrentParticipants() + 1);
        OnlineClass updatedClass = onlineClassRepository.save(onlineClass);
        return convertToDTO(updatedClass);
    }
    
    public OnlineClassDTO leaveClass(String roomId) {
        OnlineClass onlineClass = onlineClassRepository.findByRoomId(roomId);
        if (onlineClass == null) {
            throw new RuntimeException("Class not found");
        }
        
        if (onlineClass.getCurrentParticipants() > 0) {
            onlineClass.setCurrentParticipants(onlineClass.getCurrentParticipants() - 1);
            OnlineClass updatedClass = onlineClassRepository.save(onlineClass);
            return convertToDTO(updatedClass);
        }
        
        return convertToDTO(onlineClass);
    }
    
    public OnlineClassDTO getClassById(Long classId) {
        OnlineClass onlineClass = onlineClassRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Online class not found"));
        return convertToDTO(onlineClass);
    }
    
    public OnlineClassDTO getClassByRoomId(String roomId) {
        OnlineClass onlineClass = onlineClassRepository.findByRoomId(roomId);
        if (onlineClass == null) {
            throw new RuntimeException("Class not found");
        }
        return convertToDTO(onlineClass);
    }
    
    private OnlineClassDTO convertToDTO(OnlineClass onlineClass) {
        return new OnlineClassDTO(
            onlineClass.getId(),
            onlineClass.getTitle(),
            onlineClass.getSubject(),
            onlineClass.getDescription(),
            onlineClass.getScheduledTime(),
            onlineClass.getDuration(),
            onlineClass.getMaxParticipants(),
            onlineClass.getStatus(),
            onlineClass.getRoomId(),
            onlineClass.getTeacher().getUser().getName(),
            onlineClass.getTeacher().getId(),
            onlineClass.getCreatedAt(),
            onlineClass.getUpdatedAt(),
            onlineClass.getCurrentParticipants(),
            onlineClass.getMeetingUrl()
        );
    }
} 