package com.epathshala.service;

import com.epathshala.dto.AttendanceDTO;
import com.epathshala.dto.TeacherDashboardDTO;
import com.epathshala.entity.Attendance;
import com.epathshala.entity.Student;
import com.epathshala.entity.Teacher;
import com.epathshala.repository.AttendanceRepository;
import com.epathshala.repository.StudentRepository;
import com.epathshala.repository.TeacherRepository;
import com.epathshala.dto.GradeDTO;
import com.epathshala.entity.Grade;
import com.epathshala.repository.GradeRepository;
import com.epathshala.dto.AssignmentDTO;
import com.epathshala.entity.Assignment;
import com.epathshala.repository.AssignmentRepository;
import com.epathshala.dto.LeaveApprovalDTO;
import com.epathshala.entity.LeaveRequest;
import com.epathshala.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;

@Service
public class TeacherService {
    @Autowired
    private AttendanceRepository attendanceRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private GradeRepository gradeRepository;
    @Autowired
    private AssignmentRepository assignmentRepository;
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    private void notifyAssignment(Assignment assignment) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            restTemplate.postForObject("http://localhost:8081/api/notify/assignment", Map.of("title", assignment.getTitle()), String.class);
        } catch (Exception ignored) {}
    }
    private void notifyLeaveApproval(String status) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            restTemplate.postForObject("http://localhost:8081/api/notify/leaveApproval", Map.of("status", status), String.class);
        } catch (Exception ignored) {}
    }

    public Map<String, Object> markAttendance(AttendanceDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId()).orElse(null);
        if (student == null) {
            return Map.of("error", "Student not found");
        }
        // For demo, assume teacher is the first in the repo (in real app, get from auth context)
        Teacher teacher = teacherRepository.findAll().stream().findFirst().orElse(null);
        if (teacher == null) {
            return Map.of("error", "Teacher not found");
        }
        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setDate(dto.getDate() != null ? dto.getDate() : LocalDate.now());
        attendance.setStatus(dto.getStatus());
        attendance.setMarkedBy(teacher);
        attendanceRepository.save(attendance);
        return Map.of("attendanceId", attendance.getId());
    }

    public List<TeacherDashboardDTO.StudentResponseDTO> getStudentsByClass(String className) {
        try {
            return studentRepository.findAll().stream()
                .filter(s -> className != null && className.equals(s.getStudentClass()))
                .map(student -> new TeacherDashboardDTO.StudentResponseDTO(
                    student.getId(),
                    student.getUser() != null ? student.getUser().getName() : "Unknown",
                    student.getUser() != null ? student.getUser().getEmail() : "unknown@email.com",
                    student.getStudentClass()
                ))
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error in getStudentsByClass: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    public List<TeacherDashboardDTO.AttendanceResponseDTO> getAttendanceByClass(String className) {
        try {
            // Fetch all students in the class
            List<Student> students = studentRepository.findAll();
            List<Long> studentIds = students.stream()
                .filter(s -> className != null && className.equals(s.getStudentClass()))
                .map(Student::getId)
                .toList();
            // Fetch attendance for these students
            List<Attendance> attendanceList = attendanceRepository.findAll();
            return attendanceList.stream()
                .filter(a -> a.getStudent() != null && studentIds.contains(a.getStudent().getId()))
                .map(attendance -> new TeacherDashboardDTO.AttendanceResponseDTO(
                    attendance.getId(),
                    attendance.getStudent().getId(),
                    attendance.getStudent().getUser() != null ? attendance.getStudent().getUser().getName() : "Unknown",
                    attendance.getDate(),
                    attendance.getStatus()
                ))
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error in getAttendanceByClass: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    public Map<String, Object> enterGrade(GradeDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId()).orElse(null);
        if (student == null) {
            return Map.of("error", "Student not found");
        }
        // For demo, assume teacher is the first in the repo (in real app, get from auth context)
        Teacher teacher = teacherRepository.findAll().stream().findFirst().orElse(null);
        if (teacher == null) {
            return Map.of("error", "Teacher not found");
        }
        Grade grade = new Grade();
        grade.setStudent(student);
        grade.setSubject(dto.getSubject());
        grade.setMarks(dto.getMarks());
        grade.setTeacher(teacher);
        gradeRepository.save(grade);
        return Map.of("gradeId", grade.getId());
    }

    public List<TeacherDashboardDTO.GradeResponseDTO> getGradesByClass(String className) {
        try {
            List<Student> students = studentRepository.findAll();
            List<Long> studentIds = students.stream()
                .filter(s -> className != null && className.equals(s.getStudentClass()))
                .map(Student::getId)
                .toList();
            List<Grade> grades = gradeRepository.findAll();
            return grades.stream()
                .filter(g -> g.getStudent() != null && studentIds.contains(g.getStudent().getId()))
                .map(grade -> new TeacherDashboardDTO.GradeResponseDTO(
                    grade.getId(),
                    grade.getStudent().getId(),
                    grade.getStudent().getUser() != null ? grade.getStudent().getUser().getName() : "Unknown",
                    grade.getSubject(),
                    grade.getMarks(),
                    null // remarks field not in entity
                ))
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error in getGradesByClass: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    public Map<String, Object> uploadAssignment(AssignmentDTO dto) {
        System.out.println("=== TeacherService.uploadAssignment called ===");
        System.out.println("Title: " + dto.getTitle());
        System.out.println("Description: " + dto.getDescription());
        System.out.println("FileUrl: " + dto.getFileUrl());
        System.out.println("FileName: " + dto.getFileName());
        System.out.println("FileSize: " + dto.getFileSize());
        System.out.println("FileType: " + dto.getFileType());
        System.out.println("DueDate: " + dto.getDueDate());
        System.out.println("Subject: " + dto.getSubject());
        System.out.println("ClassName: " + dto.getClassName());
        
        // For demo, assume teacher is the first in the repo (in real app, get from auth context)
        Teacher teacher = teacherRepository.findAll().stream().findFirst().orElse(null);
        if (teacher == null) {
            System.out.println("ERROR: Teacher not found");
            return Map.of("error", "Teacher not found");
        }
        System.out.println("Found teacher: " + teacher.getId());
        
        Assignment assignment = new Assignment();
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setFileUrl(dto.getFileUrl());
        assignment.setFileName(dto.getFileName());
        assignment.setFileSize(dto.getFileSize());
        assignment.setFileType(dto.getFileType());
        assignment.setDueDate(dto.getDueDate());
        assignment.setSubject(dto.getSubject());
        assignment.setClassName(dto.getClassName());
        assignment.setTeacher(teacher);
        assignment.setCreatedAt(LocalDateTime.now());
        assignment.setUpdatedAt(LocalDateTime.now());
        
        System.out.println("Saving assignment with ID: " + assignment.getId());
        assignmentRepository.save(assignment);
        System.out.println("Assignment saved with ID: " + assignment.getId());
        
        notifyAssignment(assignment);
        return Map.of("assignmentId", assignment.getId());
    }

    public List<TeacherDashboardDTO.AssignmentResponseDTO> getAssignmentsByClass(String className) {
        try {
            return assignmentRepository.findAll().stream()
                .filter(a -> className != null && className.equals(a.getClassName()))
                .map(assignment -> new TeacherDashboardDTO.AssignmentResponseDTO(
                    assignment.getId(),
                    assignment.getTitle(),
                    assignment.getFileUrl(),
                    assignment.getDueDate(),
                    assignment.getSubject(),
                    assignment.getClassName()
                ))
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error in getAssignmentsByClass: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    public List<TeacherDashboardDTO.LeaveRequestResponseDTO> getLeavesByClass(String className) {
        try {
            List<Student> students = studentRepository.findAll();
            List<Long> studentIds = students.stream()
                .filter(s -> className != null && className.equals(s.getStudentClass()))
                .map(Student::getId)
                .toList();
            return leaveRequestRepository.findAll().stream()
                .filter(l -> l.getStudent() != null && studentIds.contains(l.getStudent().getId()))
                .map(leave -> new TeacherDashboardDTO.LeaveRequestResponseDTO(
                    leave.getId(),
                    leave.getStudent().getId(),
                    leave.getStudent().getUser() != null ? leave.getStudent().getUser().getName() : "Unknown",
                    leave.getReason(),
                    leave.getFromDate(),
                    leave.getToDate(),
                    leave.getTeacherApproval(),
                    leave.getParentApproval(),
                    leave.getStatus()
                ))
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error in getLeavesByClass: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    public Map<String, Object> approveLeave(LeaveApprovalDTO dto) {
        try {
            System.out.println("=== TeacherService.approveLeave called ===");
            System.out.println("Leave ID: " + dto.getLeaveId());
            System.out.println("Approver Role: " + dto.getApproverRole());
            System.out.println("Approval Status: " + dto.getApprovalStatus());
            
            LeaveRequest leave = leaveRequestRepository.findById(dto.getLeaveId()).orElse(null);
            if (leave == null) {
                System.out.println("ERROR: Leave request not found for ID: " + dto.getLeaveId());
                return Map.of("error", "Leave request not found");
            }
            
            System.out.println("Found leave request: " + leave.getId());
            System.out.println("Current teacher approval: " + leave.getTeacherApproval());
            System.out.println("Current parent approval: " + leave.getParentApproval());
            System.out.println("Current status: " + leave.getStatus());
            
            if ("TEACHER".equalsIgnoreCase(dto.getApproverRole())) {
                leave.setTeacherApproval(dto.getApprovalStatus());
                System.out.println("Updated teacher approval to: " + dto.getApprovalStatus());
            } else if ("PARENT".equalsIgnoreCase(dto.getApproverRole())) {
                leave.setParentApproval(dto.getApprovalStatus());
                System.out.println("Updated parent approval to: " + dto.getApprovalStatus());
            }
            
            // Final status logic
            if ("Approved".equalsIgnoreCase(leave.getTeacherApproval()) && "Approved".equalsIgnoreCase(leave.getParentApproval())) {
                leave.setStatus("Approved");
            } else if ("Rejected".equalsIgnoreCase(leave.getTeacherApproval()) || "Rejected".equalsIgnoreCase(leave.getParentApproval())) {
                leave.setStatus("Rejected");
            } else {
                leave.setStatus("Pending");
            }
            
            System.out.println("Final status set to: " + leave.getStatus());
            
            leaveRequestRepository.save(leave);
            System.out.println("Leave request saved successfully");
            
            notifyLeaveApproval(leave.getStatus());
            return Map.of("leaveId", leave.getId(), "status", leave.getStatus());
        } catch (Exception e) {
            System.out.println("ERROR in approveLeave: " + e.getMessage());
            e.printStackTrace();
            return Map.of("error", "Error approving leave request: " + e.getMessage());
        }
    }
}