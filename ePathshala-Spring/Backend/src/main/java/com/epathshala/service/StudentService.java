package com.epathshala.service;

import com.epathshala.entity.Attendance;
import com.epathshala.repository.AttendanceRepository;
import com.epathshala.entity.Grade;
import com.epathshala.repository.GradeRepository;
import com.epathshala.entity.Assignment;
import com.epathshala.repository.AssignmentRepository;
import com.epathshala.dto.LeaveRequestDTO;
import com.epathshala.entity.LeaveRequest;
import com.epathshala.repository.LeaveRequestRepository;
import com.epathshala.entity.Student;
import com.epathshala.repository.StudentRepository;
import com.epathshala.entity.User;
import com.epathshala.repository.UserRepository;
import com.epathshala.dto.StudentDashboardDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StudentService {
    @Autowired
    private AttendanceRepository attendanceRepository;
    @Autowired
    private GradeRepository gradeRepository;
    @Autowired
    private AssignmentRepository assignmentRepository;
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private UserRepository userRepository;

    private Student findStudentByUserId(Long userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                System.out.println("❌ User not found for ID: " + userId);
                return null;
            }
            
            List<Student> allStudents = studentRepository.findAll();
            Student student = allStudents.stream()
                .filter(s -> s.getUser() != null && s.getUser().getId().equals(userId))
                .findFirst()
                .orElse(null);
                
            if (student == null) {
                System.out.println("❌ Student not found for User ID: " + userId);
                return null;
            }
            
            System.out.println("✅ Found student: " + student.getUser().getName() + " for User ID: " + userId);
            return student;
        } catch (Exception e) {
            System.out.println("❌ Error in findStudentByUserId: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public List<StudentDashboardDTO.AttendanceResponseDTO> getAttendance(Long userId) {
        try {
            Student student = findStudentByUserId(userId);
            if (student == null) {
                return List.of();
            }
            
            List<Attendance> allAttendance = attendanceRepository.findAll();
            List<StudentDashboardDTO.AttendanceResponseDTO> studentAttendance = allAttendance.stream()
                .filter(a -> a.getStudent() != null && a.getStudent().getId().equals(student.getId()))
                .map(a -> new StudentDashboardDTO.AttendanceResponseDTO(
                    a.getId(),
                    a.getDate(),
                    a.getStatus(),
                    a.getMarkedBy() != null ? a.getMarkedBy().getUser().getName() : "Unknown"
                ))
                .collect(Collectors.toList());
            
            System.out.println("✅ Found " + studentAttendance.size() + " attendance records for student " + student.getId());
            return studentAttendance;
        } catch (Exception e) {
            System.out.println("❌ Error in getAttendance: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    public List<StudentDashboardDTO.GradeResponseDTO> getGrades(Long userId) {
        try {
            Student student = findStudentByUserId(userId);
            if (student == null) {
                return List.of();
            }
            
            List<Grade> allGrades = gradeRepository.findAll();
            List<StudentDashboardDTO.GradeResponseDTO> studentGrades = allGrades.stream()
                .filter(g -> g.getStudent() != null && g.getStudent().getId().equals(student.getId()))
                .map(g -> new StudentDashboardDTO.GradeResponseDTO(
                    g.getId(),
                    g.getSubject(),
                    g.getMarks(),
                    g.getTeacher() != null ? g.getTeacher().getUser().getName() : "Unknown"
                ))
                .collect(Collectors.toList());
            
            System.out.println("✅ Found " + studentGrades.size() + " grade records for student " + student.getId());
            return studentGrades;
        } catch (Exception e) {
            System.out.println("❌ Error in getGrades: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    public List<StudentDashboardDTO.AssignmentResponseDTO> getAssignmentsByClass(String className) {
        try {
            List<Assignment> allAssignments = assignmentRepository.findAll();
            List<StudentDashboardDTO.AssignmentResponseDTO> classAssignments = allAssignments.stream()
                .filter(a -> className != null && className.equals(a.getClassName()))
                .map(a -> new StudentDashboardDTO.AssignmentResponseDTO(
                    a.getId(),
                    a.getTitle(),
                    a.getSubject(),
                    a.getDueDate(),
                    a.getFileUrl()
                ))
                .collect(Collectors.toList());
            
            System.out.println("✅ Found " + classAssignments.size() + " assignment records for class " + className);
            return classAssignments;
        } catch (Exception e) {
            System.out.println("❌ Error in getAssignmentsByClass: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    public Map<String, Object> submitLeave(LeaveRequestDTO dto) {
        try {
            Student student = findStudentByUserId(dto.getStudentId());
            if (student == null) {
                return Map.of("error", "Student not found");
            }
            
        LeaveRequest leave = new LeaveRequest();
            leave.setStudent(student);
        leave.setReason(dto.getReason());
        leave.setFromDate(dto.getFromDate());
        leave.setToDate(dto.getToDate());
        leave.setTeacherApproval("Pending");
        leave.setParentApproval("Pending");
        leave.setStatus("Pending");
        leaveRequestRepository.save(leave);
        return Map.of("leaveId", leave.getId());
        } catch (Exception e) {
            System.out.println("❌ Error in submitLeave: " + e.getMessage());
            e.printStackTrace();
            return Map.of("error", "Failed to submit leave request");
        }
    }

    public List<StudentDashboardDTO.LeaveRequestResponseDTO> getLeaveStatus(Long userId) {
        try {
            Student student = findStudentByUserId(userId);
            if (student == null) {
                return List.of();
            }
            
            List<LeaveRequest> allLeaves = leaveRequestRepository.findAll();
            List<StudentDashboardDTO.LeaveRequestResponseDTO> studentLeaves = allLeaves.stream()
                .filter(l -> l.getStudent() != null && l.getStudent().getId().equals(student.getId()))
                .map(l -> new StudentDashboardDTO.LeaveRequestResponseDTO(
                    l.getId(),
                    l.getReason(),
                    l.getFromDate(),
                    l.getToDate(),
                    l.getTeacherApproval(),
                    l.getParentApproval(),
                    l.getStatus()
                ))
                .collect(Collectors.toList());
            
            System.out.println("✅ Found " + studentLeaves.size() + " leave records for student " + student.getId());
            return studentLeaves;
        } catch (Exception e) {
            System.out.println("❌ Error in getLeaveStatus: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }
}