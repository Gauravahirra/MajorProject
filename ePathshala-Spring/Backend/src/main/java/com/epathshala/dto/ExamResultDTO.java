package com.epathshala.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExamResultDTO {
    
    private Long attemptId;
    
    private Long examId;
    
    private String examTitle;
    
    private String studentName;
    
    private String studentEmail;
    
    private String startTime;
    
    private String endTime;
    
    private Long durationMinutes;
    
    private Integer totalQuestions;
    
    private Integer answeredQuestions;
    
    private Integer correctAnswers;
    
    private Integer incorrectAnswers;
    
    private Integer totalMarks;
    
    private Integer obtainedMarks;
    
    private Double percentage;
    
    private String grade;
    
    private String status;
    
    private List<ExamQuestionDTO> questionResults;
    
    // Chart data
    private Map<String, Integer> topicPerformance;
    
    private Map<String, Integer> difficultyPerformance;
    
    private Map<String, Integer> answerDistribution;
    
    private List<Map<String, Object>> timeAnalysis;
    
    private Integer unansweredQuestions;
    
    private Boolean passed;
    
    // Constructors
    public ExamResultDTO() {}
    
    public ExamResultDTO(Long attemptId, Long examId, String examTitle, String studentName,
                        String studentEmail, String startTime, String endTime,
                        Integer totalQuestions, Integer answeredQuestions, Integer correctAnswers,
                        Integer totalMarks, Integer obtainedMarks, Double percentage) {
        this.attemptId = attemptId;
        this.examId = examId;
        this.examTitle = examTitle;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalQuestions = totalQuestions;
        this.answeredQuestions = answeredQuestions;
        this.correctAnswers = correctAnswers;
        this.incorrectAnswers = answeredQuestions - correctAnswers;
        this.totalMarks = totalMarks;
        this.obtainedMarks = obtainedMarks;
        this.percentage = percentage;
        this.grade = calculateGrade(percentage);
        this.unansweredQuestions = totalQuestions - answeredQuestions;
        this.passed = percentage != null && percentage >= 40.0;
    }
    
    // Getters and Setters
    public Long getAttemptId() {
        return attemptId;
    }
    
    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }
    
    public Long getExamId() {
        return examId;
    }
    
    public void setExamId(Long examId) {
        this.examId = examId;
    }
    
    public String getExamTitle() {
        return examTitle;
    }
    
    public void setExamTitle(String examTitle) {
        this.examTitle = examTitle;
    }
    
    public String getStudentName() {
        return studentName;
    }
    
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
    
    public String getStudentEmail() {
        return studentEmail;
    }
    
    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
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
    
    public Long getDurationMinutes() {
        return durationMinutes;
    }
    
    public void setDurationMinutes(Long durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
    
    public Integer getTotalQuestions() {
        return totalQuestions;
    }
    
    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }
    
    public Integer getAnsweredQuestions() {
        return answeredQuestions;
    }
    
    public void setAnsweredQuestions(Integer answeredQuestions) {
        this.answeredQuestions = answeredQuestions;
    }
    
    public Integer getCorrectAnswers() {
        return correctAnswers;
    }
    
    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }
    
    public Integer getIncorrectAnswers() {
        return incorrectAnswers;
    }
    
    public void setIncorrectAnswers(Integer incorrectAnswers) {
        this.incorrectAnswers = incorrectAnswers;
    }
    
    public Integer getTotalMarks() {
        return totalMarks;
    }
    
    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }
    
    public Integer getObtainedMarks() {
        return obtainedMarks;
    }
    
    public void setObtainedMarks(Integer obtainedMarks) {
        this.obtainedMarks = obtainedMarks;
    }
    
    public Double getPercentage() {
        return percentage;
    }
    
    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }
    
    public String getGrade() {
        return grade;
    }
    
    public void setGrade(String grade) {
        this.grade = grade;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public List<ExamQuestionDTO> getQuestionResults() {
        return questionResults;
    }
    
    public void setQuestionResults(List<ExamQuestionDTO> questionResults) {
        this.questionResults = questionResults;
    }
    
    public Map<String, Integer> getTopicPerformance() {
        return topicPerformance;
    }
    
    public void setTopicPerformance(Map<String, Integer> topicPerformance) {
        this.topicPerformance = topicPerformance;
    }
    
    public Map<String, Integer> getDifficultyPerformance() {
        return difficultyPerformance;
    }
    
    public void setDifficultyPerformance(Map<String, Integer> difficultyPerformance) {
        this.difficultyPerformance = difficultyPerformance;
    }
    
    public Map<String, Integer> getAnswerDistribution() {
        return answerDistribution;
    }
    
    public void setAnswerDistribution(Map<String, Integer> answerDistribution) {
        this.answerDistribution = answerDistribution;
    }
    
    public List<Map<String, Object>> getTimeAnalysis() {
        return timeAnalysis;
    }
    
    public void setTimeAnalysis(List<Map<String, Object>> timeAnalysis) {
        this.timeAnalysis = timeAnalysis;
    }
    
    public Integer getUnansweredQuestions() {
        return unansweredQuestions;
    }
    
    public void setUnansweredQuestions(Integer unansweredQuestions) {
        this.unansweredQuestions = unansweredQuestions;
    }
    
    public Boolean getPassed() {
        return passed;
    }
    
    public void setPassed(Boolean passed) {
        this.passed = passed;
    }
    
    // Helper methods
    private String calculateGrade(Double percentage) {
        if (percentage == null) return "N/A";
        
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B+";
        if (percentage >= 60) return "B";
        if (percentage >= 50) return "C+";
        if (percentage >= 40) return "C";
        if (percentage >= 30) return "D";
        return "F";
    }
    
    public boolean isPassed() {
        return percentage != null && percentage >= 40.0;
    }
} 