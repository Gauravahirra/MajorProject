package com.epathshala.service;

import com.epathshala.dto.AssignmentDTO;
import com.epathshala.dto.AssignmentSubmissionDTO;
import com.epathshala.entity.Assignment;
import com.epathshala.entity.AssignmentSubmission;
import com.epathshala.entity.Student;
import com.epathshala.entity.Teacher;
import com.epathshala.repository.AssignmentRepository;
import com.epathshala.repository.AssignmentSubmissionRepository;
import com.epathshala.repository.StudentRepository;
import com.epathshala.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AssignmentService {
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private AssignmentSubmissionRepository submissionRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private TeacherRepository teacherRepository;
    
    @Autowired
    private FileService fileService;
    
    // Create new assignment with file upload
    public AssignmentDTO createAssignment(AssignmentDTO dto, MultipartFile file, Long teacherId) throws IOException {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        
        if (file != null && !file.isEmpty()) {
            if (!fileService.isValidFileType(file)) {
                throw new RuntimeException("Invalid file type. Only PDF, DOC, DOCX, JPG, PNG are allowed.");
            }
            
            String filename = fileService.uploadAssignmentFile(file);
            dto.setFileUrl(filename);
            dto.setFileName(file.getOriginalFilename());
            dto.setFileSize(file.getSize());
            dto.setFileType(file.getContentType());
        }
        
        Assignment assignment = new Assignment(
            dto.getTitle(),
            dto.getDescription(),
            dto.getFileUrl(),
            dto.getDueDate(),
            dto.getSubject(),
            dto.getClassName(),
            teacher,
            dto.getFileName(),
            dto.getFileSize(),
            dto.getFileType()
        );
        
        Assignment savedAssignment = assignmentRepository.save(assignment);
        return convertToDTO(savedAssignment);
    }
    
    // Get assignment by ID
    public AssignmentDTO getAssignmentById(Long id) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        return convertToDTO(assignment);
    }
    
    // Get assignments by class
    public List<AssignmentDTO> getAssignmentsByClass(String className) {
        return assignmentRepository.findByClassNameOrderByCreatedAtDesc(className)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get assignments by teacher
    public List<AssignmentDTO> getAssignmentsByTeacher(Long teacherId) {
        return assignmentRepository.findByTeacherIdOrderByCreatedAtDesc(teacherId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get all assignments
    public List<AssignmentDTO> getAllAssignments() {
        return assignmentRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Download assignment file
    public Resource downloadAssignmentFile(String filename) throws MalformedURLException {
        return fileService.loadAssignmentFile(filename);
    }
    
    // Submit assignment
    public AssignmentSubmissionDTO submitAssignment(Long assignmentId, Long studentId, 
                                                  MultipartFile file, String submissionText) throws IOException {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Check if already submitted
        Optional<AssignmentSubmission> existingSubmission = submissionRepository
                .findByAssignmentIdAndStudentId(assignmentId, studentId);
        
        if (existingSubmission.isPresent()) {
            throw new RuntimeException("Assignment already submitted");
        }
        
        String submissionFileUrl = null;
        if (file != null && !file.isEmpty()) {
            if (!fileService.isValidFileType(file)) {
                throw new RuntimeException("Invalid file type. Only PDF, DOC, DOCX, JPG, PNG are allowed.");
            }
            submissionFileUrl = fileService.uploadSubmissionFile(file);
        }
        
        AssignmentSubmission submission = new AssignmentSubmission(assignment, student, submissionFileUrl, submissionText);
        AssignmentSubmission savedSubmission = submissionRepository.save(submission);
        
        return convertSubmissionToDTO(savedSubmission);
    }
    
    // Get submission by ID
    public AssignmentSubmissionDTO getSubmissionById(Long id) {
        AssignmentSubmission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        return convertSubmissionToDTO(submission);
    }
    
    // Get submissions by assignment
    public List<AssignmentSubmissionDTO> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentIdOrderBySubmittedAtDesc(assignmentId)
                .stream()
                .map(this::convertSubmissionToDTO)
                .collect(Collectors.toList());
    }
    
    // Get submissions by student
    public List<AssignmentSubmissionDTO> getSubmissionsByStudent(Long studentId) {
        return submissionRepository.findByStudentIdOrderBySubmittedAtDesc(studentId)
                .stream()
                .map(this::convertSubmissionToDTO)
                .collect(Collectors.toList());
    }
    
    // Grade submission
    public AssignmentSubmissionDTO gradeSubmission(Long submissionId, Double grade, String feedback) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        
        submission.setGrade(grade);
        submission.setFeedback(feedback);
        submission.setStatus("graded");
        
        AssignmentSubmission savedSubmission = submissionRepository.save(submission);
        return convertSubmissionToDTO(savedSubmission);
    }
    
    // Download submission file
    public Resource downloadSubmissionFile(String filename) throws MalformedURLException {
        return fileService.loadSubmissionFile(filename);
    }
    
    // Check if student has submitted
    public Boolean hasStudentSubmitted(Long assignmentId, Long studentId) {
        return submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId).isPresent();
    }
    
    // Get submission statistics
    public Map<String, Object> getSubmissionStats(Long assignmentId) {
        List<AssignmentSubmission> submissions = submissionRepository.findByAssignmentIdOrderBySubmittedAtDesc(assignmentId);
        
        long totalSubmissions = submissions.size();
        long onTimeSubmissions = submissions.stream().filter(s -> !s.getSubmittedLate()).count();
        long lateSubmissions = submissions.stream().filter(AssignmentSubmission::getSubmittedLate).count();
        long gradedSubmissions = submissions.stream().filter(s -> s.getGrade() != null).count();
        
        return Map.of(
            "totalSubmissions", totalSubmissions,
            "onTimeSubmissions", onTimeSubmissions,
            "lateSubmissions", lateSubmissions,
            "gradedSubmissions", gradedSubmissions,
            "ungradedSubmissions", totalSubmissions - gradedSubmissions
        );
    }
    
    // Convert Assignment to DTO
    private AssignmentDTO convertToDTO(Assignment assignment) {
        AssignmentDTO dto = new AssignmentDTO();
        dto.setId(assignment.getId());
        dto.setTitle(assignment.getTitle());
        dto.setDescription(assignment.getDescription());
        dto.setFileUrl(assignment.getFileUrl());
        dto.setDueDate(assignment.getDueDate());
        dto.setSubject(assignment.getSubject());
        dto.setClassName(assignment.getClassName());
        dto.setFileName(assignment.getFileName());
        dto.setFileSize(assignment.getFileSize());
        dto.setFileType(assignment.getFileType());
        dto.setCreatedAt(assignment.getCreatedAt());
        dto.setUpdatedAt(assignment.getUpdatedAt());
        dto.setTeacherName(assignment.getTeacher().getUser().getName());
        dto.setTeacherId(assignment.getTeacher().getId());
        
        // Get submission count
        long submissionCount = submissionRepository.countSubmissionsByAssignment(assignment.getId());
        dto.setSubmissionCount((int) submissionCount);
        
        return dto;
    }
    
    // Convert AssignmentSubmission to DTO
    private AssignmentSubmissionDTO convertSubmissionToDTO(AssignmentSubmission submission) {
        AssignmentSubmissionDTO dto = new AssignmentSubmissionDTO();
        dto.setId(submission.getId());
        dto.setAssignmentId(submission.getAssignment().getId());
        dto.setStudentId(submission.getStudent().getId());
        dto.setStudentName(submission.getStudent().getUser().getName());
        dto.setSubmissionFileUrl(submission.getSubmissionFileUrl());
        dto.setSubmissionText(submission.getSubmissionText());
        dto.setSubmittedAt(submission.getSubmittedAt());
        dto.setGrade(submission.getGrade());
        dto.setFeedback(submission.getFeedback());
        dto.setStatus(submission.getStatus());
        dto.setSubmittedLate(submission.getSubmittedLate());
        dto.setAssignmentTitle(submission.getAssignment().getTitle());
        dto.setSubject(submission.getAssignment().getSubject());
        dto.setClassName(submission.getAssignment().getClassName());
        
        return dto;
    }
} 