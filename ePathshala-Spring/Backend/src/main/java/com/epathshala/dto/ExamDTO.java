package com.epathshala.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExamDTO {
    
    private Long id;
    
    @NotBlank(message = "Exam title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    private Integer durationMinutes;
    
    @NotNull(message = "Start time is required")
    private String startTime;
    
    @NotNull(message = "End time is required")
    private String endTime;
    
    @NotNull(message = "Total marks is required")
    @Positive(message = "Total marks must be positive")
    private Integer totalMarks;
    
    private Boolean negativeMarking = false;
    
    private Double negativeMarkingPercentage = 0.0;
    
    private Boolean isActive = true;
    
    private Long courseId;
    
    private String courseName;
    
    private String createdBy;
    
    private Integer questionCount;
    
    private String status; // UPCOMING, ACTIVE, COMPLETED
    
    private List<ExamQuestionDTO> questions;
    
    private ExamResultDTO result;
    
    // Constructors
    public ExamDTO() {}
    
    public ExamDTO(Long id, String title, String description, Integer durationMinutes,
                   String startTime, String endTime, Integer totalMarks) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalMarks = totalMarks;
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
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getDurationMinutes() {
        return durationMinutes;
    }
    
    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
    
    public String getStartTime() {
        return startTime;
    }
    
    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }
    
    public String getEndTime() {
        return endTime;
    }
    
    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
    
    public Integer getTotalMarks() {
        return totalMarks;
    }
    
    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }
    
    public Boolean getNegativeMarking() {
        return negativeMarking;
    }
    
    public void setNegativeMarking(Boolean negativeMarking) {
        this.negativeMarking = negativeMarking;
    }
    
    public Double getNegativeMarkingPercentage() {
        return negativeMarkingPercentage;
    }
    
    public void setNegativeMarkingPercentage(Double negativeMarkingPercentage) {
        this.negativeMarkingPercentage = negativeMarkingPercentage;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public Long getCourseId() {
        return courseId;
    }
    
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
    
    public String getCourseName() {
        return courseName;
    }
    
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    
    public Integer getQuestionCount() {
        return questionCount;
    }
    
    public void setQuestionCount(Integer questionCount) {
        this.questionCount = questionCount;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public List<ExamQuestionDTO> getQuestions() {
        return questions;
    }
    
    public void setQuestions(List<ExamQuestionDTO> questions) {
        this.questions = questions;
    }
    
    public ExamResultDTO getResult() {
        return result;
    }
    
    public void setResult(ExamResultDTO result) {
        this.result = result;
    }
} 