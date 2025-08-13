package com.epathshala.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "online_classes")
public class OnlineClass {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String subject;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime scheduledTime;
    
    @Column(nullable = false)
    private Integer duration; // in minutes
    
    @Column(nullable = false)
    private Integer maxParticipants;
    
    @Column(nullable = false)
    private String status; // scheduled, active, completed, cancelled
    
    @Column(nullable = false)
    private String roomId; // Jitsi Meet room ID
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "current_participants")
    private Integer currentParticipants = 0;
    
    @Column(name = "meeting_url")
    private String meetingUrl;
    
    // Constructors
    public OnlineClass() {}
    
    public OnlineClass(String title, String subject, String description, LocalDateTime scheduledTime, 
                      Integer duration, Integer maxParticipants, Teacher teacher) {
        this.title = title;
        this.subject = subject;
        this.description = description;
        this.scheduledTime = scheduledTime;
        this.duration = duration;
        this.maxParticipants = maxParticipants;
        this.teacher = teacher;
        this.status = "scheduled";
        this.roomId = "epathshala-" + System.currentTimeMillis();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.meetingUrl = "https://meet.jit.si/" + this.roomId;
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
    
    public Teacher getTeacher() {
        return teacher;
    }
    
    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
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
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
} 