package com.epathshala.dto;

import java.time.LocalDateTime;

public class OnlineClassDTO {
    
    private Long id;
    private String title;
    private String subject;
    private String description;
    private LocalDateTime scheduledTime;
    private Integer duration;
    private Integer maxParticipants;
    private String status;
    private String roomId;
    private String teacherName;
    private Long teacherId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer currentParticipants;
    private String meetingUrl;
    
    // Constructors
    public OnlineClassDTO() {}
    
    public OnlineClassDTO(Long id, String title, String subject, String description, 
                         LocalDateTime scheduledTime, Integer duration, Integer maxParticipants, 
                         String status, String roomId, String teacherName, Long teacherId,
                         LocalDateTime createdAt, LocalDateTime updatedAt, 
                         Integer currentParticipants, String meetingUrl) {
        this.id = id;
        this.title = title;
        this.subject = subject;
        this.description = description;
        this.scheduledTime = scheduledTime;
        this.duration = duration;
        this.maxParticipants = maxParticipants;
        this.status = status;
        this.roomId = roomId;
        this.teacherName = teacherName;
        this.teacherId = teacherId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.currentParticipants = currentParticipants;
        this.meetingUrl = meetingUrl;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getSubject() {
        return subject;
    }
    
    public void setSubject(String subject) {
        this.subject = subject;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }
    
    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }
    
    public Integer getDuration() {
        return duration;
    }
    
    public void setDuration(Integer duration) {
        this.duration = duration;
    }
    
    public Integer getMaxParticipants() {
        return maxParticipants;
    }
    
    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getRoomId() {
        return roomId;
    }
    
    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }
    
    public String getTeacherName() {
        return teacherName;
    }
    
    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }
    
    public Long getTeacherId() {
        return teacherId;
    }
    
    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Integer getCurrentParticipants() {
        return currentParticipants;
    }
    
    public void setCurrentParticipants(Integer currentParticipants) {
        this.currentParticipants = currentParticipants;
    }
    
    public String getMeetingUrl() {
        return meetingUrl;
    }
    
    public void setMeetingUrl(String meetingUrl) {
        this.meetingUrl = meetingUrl;
    }
} 