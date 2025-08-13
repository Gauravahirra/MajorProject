package com.epathshala.service;

import com.epathshala.dto.ExamDTO;
import com.epathshala.dto.ExamQuestionDTO;
import com.epathshala.dto.ExamResultDTO;
import com.epathshala.entity.*;
import com.epathshala.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExamService {
    
    @Autowired
    private ExamRepository examRepository;
    
    @Autowired
    private ExamQuestionRepository examQuestionRepository;
    
    @Autowired
    private ExamAttemptRepository examAttemptRepository;
    
    @Autowired
    private ExamAnswerRepository examAnswerRepository;
    
    @Autowired
    private TeacherRepository teacherRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Utility method to convert ISO 8601 string to LocalDateTime
    private LocalDateTime parseDateTime(String dateTimeString) {
        if (dateTimeString == null || dateTimeString.trim().isEmpty()) {
            throw new IllegalArgumentException("Date/time string cannot be null or empty");
        }
        
        try {
            // Handle ISO 8601 format with timezone (e.g., "2025-08-06T09:00:00.000Z")
            if (dateTimeString.endsWith("Z")) {
                ZonedDateTime zonedDateTime = ZonedDateTime.parse(dateTimeString);
                return zonedDateTime.toLocalDateTime();
            } else {
                // Handle ISO 8601 format without timezone
                return LocalDateTime.parse(dateTimeString, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date/time format: " + dateTimeString + ". Expected ISO 8601 format.", e);
        }
    }
    
    // Faculty/Admin Methods
    
    @Transactional
    public ExamDTO createExam(ExamDTO examDTO, Long facultyId) {
        try {
            System.out.println("Creating exam with faculty ID: " + facultyId);
            System.out.println("Exam DTO: " + examDTO);
            
            User faculty = userRepository.findById(facultyId)
                    .orElseThrow(() -> new RuntimeException("Faculty not found with ID: " + facultyId));
            
            System.out.println("Found faculty user: " + faculty.getEmail());
            
            Teacher teacher = teacherRepository.findByUser(facultyId)
                    .orElseThrow(() -> new RuntimeException("Teacher not found for user ID: " + facultyId));
            
            System.out.println("Found teacher: " + teacher.getSubject() + " - " + teacher.getAssignedClass());
            
            // Convert string dates to LocalDateTime
            LocalDateTime startTime = parseDateTime(examDTO.getStartTime());
            LocalDateTime endTime = parseDateTime(examDTO.getEndTime());
            
            Exam exam = new Exam(
                examDTO.getTitle(),
                examDTO.getDescription(),
                examDTO.getDurationMinutes(),
                startTime,
                endTime,
                examDTO.getTotalMarks()
            );
            
            exam.setCourse(teacher);
            exam.setCreatedBy(faculty);
            exam.setNegativeMarking(examDTO.getNegativeMarking() != null ? examDTO.getNegativeMarking() : false);
            exam.setNegativeMarkingPercentage(examDTO.getNegativeMarkingPercentage() != null ? examDTO.getNegativeMarkingPercentage() : 0.0);
            exam.setIsActive(examDTO.getIsActive() != null ? examDTO.getIsActive() : true);
            
            System.out.println("Saving exam to database...");
            Exam savedExam = examRepository.save(exam);
            System.out.println("Exam saved with ID: " + savedExam.getId());
            
            return convertToDTO(savedExam);
        } catch (Exception e) {
            System.err.println("Error in createExam: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @Transactional
    public ExamDTO addQuestions(Long examId, List<ExamQuestionDTO> questions) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        
        List<ExamQuestion> examQuestions = questions.stream()
                .map(this::convertToQuestion)
                .collect(Collectors.toList());
        
        examQuestions.forEach(question -> question.setExam(exam));
        examQuestionRepository.saveAll(examQuestions);
        
        return convertToDTO(exam);
    }
    
    public List<ExamDTO> getExamsByFaculty(Long facultyId) {
        List<Exam> exams = examRepository.findByCreatedByIdOrderByCreatedAtDesc(facultyId);
        return exams.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    public ExamDTO getExamById(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        return convertToDTO(exam);
    }
    
    public List<ExamResultDTO> getExamResults(Long examId) {
        List<ExamAttempt> attempts = examAttemptRepository.findByExamIdOrderByCreatedAtDesc(examId);
        return attempts.stream().map(this::convertToResultDTO).collect(Collectors.toList());
    }
    
    // Student Methods
    
    public List<ExamDTO> getAvailableExams(Long studentId) {
        try {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            
            List<Exam> allExams = examRepository.findAll();
            
            // Filter exams by student's class with null safety
            List<Exam> classExams = allExams.stream()
                    .filter(exam -> exam.getCourse() != null && 
                                  exam.getCourse().getAssignedClass() != null &&
                                  exam.getCourse().getAssignedClass().equals(student.getStudentClass()))
                    .collect(Collectors.toList());
            
            // Filter for active or upcoming exams
            List<Exam> availableExams = classExams.stream()
                    .filter(exam -> exam.isCurrentlyActive() || exam.isUpcoming())
                    .collect(Collectors.toList());
            
            return availableExams.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error in getAvailableExams: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    @Transactional
    public ExamDTO startExam(Long examId, Long studentId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Check if exam is currently active
        if (!exam.isCurrentlyActive()) {
            throw new RuntimeException("Exam is not currently active");
        }
        
        // Check if exam has questions
        if (exam.getQuestionCount() == 0) {
            throw new RuntimeException("Exam has no questions. Please add questions to the exam before starting.");
        }
        
        // Check if student has already attempted this exam
        Optional<ExamAttempt> existingAttempt = examAttemptRepository.findByExamIdAndStudentId(examId, studentId);
        if (existingAttempt.isPresent()) {
            throw new RuntimeException("Student has already attempted this exam");
        }
        
        // Create new attempt
        ExamAttempt attempt = new ExamAttempt(exam, student);
        attempt.setTotalMarks(exam.getQuestions().stream().mapToInt(ExamQuestion::getMarks).sum());
        examAttemptRepository.save(attempt);
        
        return convertToDTO(exam);
    }
    
    @Transactional
    public ExamResultDTO submitExam(Long examId, Long studentId, Map<Long, String> answers) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        ExamAttempt attempt = examAttemptRepository.findByExamIdAndStudentId(examId, studentId)
                .orElseThrow(() -> new RuntimeException("No active attempt found"));
        
        if (attempt.isCompleted()) {
            throw new RuntimeException("Exam has already been submitted");
        }
        
        // Save answers
        List<ExamAnswer> examAnswers = new ArrayList<>();
        for (Map.Entry<Long, String> entry : answers.entrySet()) {
            ExamQuestion question = examQuestionRepository.findById(entry.getKey())
                    .orElseThrow(() -> new RuntimeException("Question not found"));
            
            ExamAnswer answer = new ExamAnswer(attempt, question, entry.getValue());
            answer.calculateMarks();
            examAnswers.add(answer);
        }
        
        examAnswerRepository.saveAll(examAnswers);
        
        // Calculate results
        attempt.calculateResults();
        attempt.setEndTime(LocalDateTime.now());
        attempt.setStatus("COMPLETED");
        examAttemptRepository.save(attempt);
        
        return convertToResultDTO(attempt);
    }
    
    public ExamResultDTO getExamResult(Long examId, Long studentId) {
        ExamAttempt attempt = examAttemptRepository.findByExamIdAndStudentId(examId, studentId)
                .orElseThrow(() -> new RuntimeException("No attempt found"));
        
        return convertToResultDTO(attempt);
    }
    
    // Additional methods for controllers
    
    public List<ExamResultDTO> getExamHistory(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        List<ExamAttempt> attempts = examAttemptRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
        return attempts.stream().map(this::convertToResultDTO).collect(Collectors.toList());
    }
    
    public Map<String, Object> getExamTimer(Long examId, Long studentId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        
        ExamAttempt attempt = examAttemptRepository.findByExamIdAndStudentId(examId, studentId)
                .orElseThrow(() -> new RuntimeException("No active attempt found"));
        
        if (attempt.isCompleted()) {
            throw new RuntimeException("Exam has already been completed");
        }
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endTime = attempt.getStartTime().plusMinutes(exam.getDurationMinutes());
        long remainingSeconds = java.time.Duration.between(now, endTime).getSeconds();
        
        Map<String, Object> timer = new HashMap<>();
        timer.put("remainingSeconds", Math.max(0, remainingSeconds));
        timer.put("isExpired", remainingSeconds <= 0);
        timer.put("startTime", attempt.getStartTime());
        timer.put("endTime", endTime);
        timer.put("durationMinutes", exam.getDurationMinutes());
        
        return timer;
    }
    
    @Transactional
    public ExamDTO activateExam(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        
        exam.setIsActive(true);
        Exam savedExam = examRepository.save(exam);
        return convertToDTO(savedExam);
    }
    
    @Transactional
    public ExamDTO deactivateExam(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        
        exam.setIsActive(false);
        Exam savedExam = examRepository.save(exam);
        return convertToDTO(savedExam);
    }
    
    @Transactional
    public void deleteExam(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        
        // Check if any attempts have been made
        List<ExamAttempt> attempts = examAttemptRepository.findByExamId(examId);
        if (!attempts.isEmpty()) {
            throw new RuntimeException("Cannot delete exam that has been attempted by students");
        }
        
        // Delete questions first
        examQuestionRepository.deleteByExamId(examId);
        
        // Delete the exam
        examRepository.delete(exam);
    }
    
    // Helper Methods
    
    private ExamDTO convertToDTO(Exam exam) {
        ExamDTO dto = new ExamDTO(
            exam.getId(),
            exam.getTitle(),
            exam.getDescription(),
            exam.getDurationMinutes(),
            exam.getStartTime() != null ? exam.getStartTime().toString() : null,
            exam.getEndTime() != null ? exam.getEndTime().toString() : null,
            exam.getTotalMarks()
        );
        
        dto.setNegativeMarking(exam.getNegativeMarking());
        dto.setNegativeMarkingPercentage(exam.getNegativeMarkingPercentage());
        dto.setIsActive(exam.getIsActive());
        
        // Add null checks for course
        if (exam.getCourse() != null) {
            dto.setCourseId(exam.getCourse().getId());
            dto.setCourseName(exam.getCourse().getAssignedClass());
        }
        
        // Add null check for createdBy
        if (exam.getCreatedBy() != null) {
            dto.setCreatedBy(exam.getCreatedBy().getName());
        }
        
        dto.setQuestionCount(exam.getQuestionCount());
        
        // Set status
        if (exam.isUpcoming()) {
            dto.setStatus("UPCOMING");
        } else if (exam.isCurrentlyActive()) {
            dto.setStatus("ACTIVE");
        } else {
            dto.setStatus("COMPLETED");
        }
        
        // Load and set questions
        List<ExamQuestion> questions = examQuestionRepository.findByExamIdOrderByCreatedAtAsc(exam.getId());
        System.out.println("Found " + questions.size() + " questions for exam " + exam.getId());
        
        List<ExamQuestionDTO> questionDTOs = questions.stream()
            .map(this::convertQuestionToDTO)
            .collect(Collectors.toList());
        
        System.out.println("Converted " + questionDTOs.size() + " question DTOs");
        dto.setQuestions(questionDTOs);
        
        return dto;
    }
    
    private ExamQuestion convertToQuestion(ExamQuestionDTO dto) {
        return new ExamQuestion(
            dto.getQuestionText(),
            dto.getOptionA(),
            dto.getOptionB(),
            dto.getOptionC(),
            dto.getOptionD(),
            dto.getCorrectAnswer(),
            dto.getMarks(),
            dto.getDifficulty(),
            dto.getTopic()
        );
    }

    private ExamQuestionDTO convertQuestionToDTO(ExamQuestion question) {
        return new ExamQuestionDTO(
            question.getId(),
            question.getQuestionText(),
            question.getOptionA(),
            question.getOptionB(),
            question.getOptionC(),
            question.getOptionD(),
            question.getCorrectAnswer(),
            question.getMarks(),
            question.getDifficulty(),
            question.getTopic()
        );
    }
    
    private ExamResultDTO convertToResultDTO(ExamAttempt attempt) {
        ExamResultDTO dto = new ExamResultDTO(
            attempt.getId(),
            attempt.getExam().getId(),
            attempt.getExam().getTitle(),
            attempt.getStudent().getUser().getName(),
            attempt.getStudent().getUser().getEmail(),
            attempt.getStartTime() != null ? attempt.getStartTime().toString() : null,
            attempt.getEndTime() != null ? attempt.getEndTime().toString() : null,
            attempt.getTotalQuestions(),
            attempt.getAnsweredQuestions(),
            attempt.getCorrectAnswers(),
            attempt.getTotalMarks(),
            attempt.getObtainedMarks(),
            attempt.getPercentage()
        );
        
        dto.setStatus(attempt.getStatus());
        dto.setDurationMinutes(attempt.getDurationInMinutes());
        
        // Add chart data
        dto.setTopicPerformance(calculateTopicPerformance(attempt));
        dto.setDifficultyPerformance(calculateDifficultyPerformance(attempt));
        dto.setAnswerDistribution(calculateAnswerDistribution(attempt));
        
        return dto;
    }
    
    private Map<String, Integer> calculateTopicPerformance(ExamAttempt attempt) {
        return attempt.getAnswers().stream()
                .collect(Collectors.groupingBy(
                    answer -> answer.getQuestion().getTopic(),
                    Collectors.summingInt(answer -> answer.getIsCorrect() ? 1 : 0)
                ));
    }
    
    private Map<String, Integer> calculateDifficultyPerformance(ExamAttempt attempt) {
        return attempt.getAnswers().stream()
                .collect(Collectors.groupingBy(
                    answer -> answer.getQuestion().getDifficulty(),
                    Collectors.summingInt(answer -> answer.getIsCorrect() ? 1 : 0)
                ));
    }
    
    private Map<String, Integer> calculateAnswerDistribution(ExamAttempt attempt) {
        Map<String, Integer> distribution = new HashMap<>();
        distribution.put("Correct", attempt.getCorrectAnswers());
        distribution.put("Incorrect", attempt.getIncorrectAnswers());
        distribution.put("Unanswered", attempt.getTotalQuestions() - attempt.getAnsweredQuestions());
        return distribution;
    }
} 