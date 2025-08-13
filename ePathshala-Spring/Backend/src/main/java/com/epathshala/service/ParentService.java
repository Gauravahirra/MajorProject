package com.epathshala.service;

import com.epathshala.entity.Parent;
import com.epathshala.entity.Student;
import com.epathshala.repository.ParentRepository;
import com.epathshala.repository.AttendanceRepository;
import com.epathshala.repository.GradeRepository;
import com.epathshala.dto.LeaveApprovalDTO;
import com.epathshala.dto.ParentDashboardDTO;
import com.epathshala.entity.LeaveRequest;
import com.epathshala.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.epathshala.repository.StudentRepository;

@Service
public class ParentService {
    @Autowired
    private ParentRepository parentRepository;
    @Autowired
    private AttendanceRepository attendanceRepository;
    @Autowired
    private GradeRepository gradeRepository;
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;
    @Autowired
    private StudentRepository studentRepository;

    public List<ParentDashboardDTO.AttendanceResponseDTO> getChildAttendance(Long userId) {
        try {
            // Find parent by user ID
            Parent parent = parentRepository.findAll().stream()
                .filter(p -> p.getUser() != null && p.getUser().getId().equals(userId))
                .findFirst()
                .orElse(null);
            
            if (parent == null) {
                System.out.println("Parent not found for userId: " + userId);
                return List.of();
            }
            
            // Find students that have this parent
            List<Student> students = studentRepository.findAll().stream()
                .filter(s -> s.getParent() != null && s.getParent().getId().equals(parent.getId()))
                .toList();
                
            if (students.isEmpty()) {
                System.out.println("No students found for parent: " + parent.getId());
                return List.of();
            }
            
            // Get attendance for all children
            return students.stream()
                .flatMap(student -> attendanceRepository.findAll().stream()
                    .filter(a -> a.getStudent() != null && a.getStudent().getId().equals(student.getId()))
                    .map(a -> new ParentDashboardDTO.AttendanceResponseDTO(
                        a.getId(),
                        a.getDate(),
                        a.getStatus(),
                        student.getUser() != null ? student.getUser().getName() : "Unknown",
                        student.getStudentClass()
                    )))
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error in getChildAttendance: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    public List<ParentDashboardDTO.GradeResponseDTO> getChildGrades(Long userId) {
        try {
            // Find parent by user ID
            Parent parent = parentRepository.findAll().stream()
                .filter(p -> p.getUser() != null && p.getUser().getId().equals(userId))
                .findFirst()
                .orElse(null);
            
            if (parent == null) {
                System.out.println("Parent not found for userId: " + userId);
                return List.of();
            }
            
            // Find students that have this parent
            List<Student> students = studentRepository.findAll().stream()
                .filter(s -> s.getParent() != null && s.getParent().getId().equals(parent.getId()))
                .toList();
                
            if (students.isEmpty()) {
                System.out.println("No students found for parent: " + parent.getId());
                return List.of();
            }
            
            // Get grades for all children
            return students.stream()
                .flatMap(student -> gradeRepository.findAll().stream()
                    .filter(g -> g.getStudent() != null && g.getStudent().getId().equals(student.getId()))
                    .map(g -> new ParentDashboardDTO.GradeResponseDTO(
                        g.getId(),
                        g.getSubject(),
                        g.getMarks(),
                        g.getTeacher() != null && g.getTeacher().getUser() != null ? 
                            g.getTeacher().getUser().getName() : "Unknown",
                        student.getUser() != null ? student.getUser().getName() : "Unknown"
                    )))
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error in getChildGrades: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    public List<ParentDashboardDTO.LeaveRequestResponseDTO> getChildLeaveStatus(Long userId) {
        try {
            // Find parent by user ID
            Parent parent = parentRepository.findAll().stream()
                .filter(p -> p.getUser() != null && p.getUser().getId().equals(userId))
                .findFirst()
                .orElse(null);
            
            if (parent == null) {
                System.out.println("Parent not found for userId: " + userId);
                return List.of();
            }
            
            // Find students that have this parent
            List<Student> students = studentRepository.findAll().stream()
                .filter(s -> s.getParent() != null && s.getParent().getId().equals(parent.getId()))
                .toList();
                
            if (students.isEmpty()) {
                System.out.println("No students found for parent: " + parent.getId());
                return List.of();
            }
            
            // Get leave requests for all children
            return students.stream()
                .flatMap(student -> leaveRequestRepository.findAll().stream()
                    .filter(l -> l.getStudent() != null && l.getStudent().getId().equals(student.getId()))
                    .map(l -> new ParentDashboardDTO.LeaveRequestResponseDTO(
                        l.getId(),
                        l.getReason(),
                        l.getFromDate(),
                        l.getToDate(),
                        l.getTeacherApproval(),
                        l.getParentApproval(),
                        l.getStatus(),
                        student.getUser() != null ? student.getUser().getName() : "Unknown"
                    )))
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error in getChildLeaveStatus: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    public Map<String, Object> approveLeave(LeaveApprovalDTO dto) {
        try {
            LeaveRequest leave = leaveRequestRepository.findById(dto.getLeaveId()).orElse(null);
            if (leave == null) {
                return Map.of("error", "Leave request not found");
            }
            if ("PARENT".equalsIgnoreCase(dto.getApproverRole())) {
                leave.setParentApproval(dto.getApprovalStatus());
            }
            // Final status logic
            if ("Approved".equalsIgnoreCase(leave.getTeacherApproval()) && "Approved".equalsIgnoreCase(leave.getParentApproval())) {
                leave.setStatus("Approved");
            } else if ("Rejected".equalsIgnoreCase(leave.getTeacherApproval()) || "Rejected".equalsIgnoreCase(leave.getParentApproval())) {
                leave.setStatus("Rejected");
            } else {
                leave.setStatus("Pending");
            }
            leaveRequestRepository.save(leave);
            return Map.of("leaveId", leave.getId(), "status", leave.getStatus());
        } catch (Exception e) {
            System.out.println("Error in approveLeave: " + e.getMessage());
            e.printStackTrace();
            return Map.of("error", "Error approving leave request");
        }
    }
}