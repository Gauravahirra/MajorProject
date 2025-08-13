package com.epathshala.service;

import com.epathshala.dto.UserDTO;
import com.epathshala.dto.UserListDTO;
import com.epathshala.entity.User;
import com.epathshala.entity.Student;
import com.epathshala.entity.Parent;
import com.epathshala.repository.UserRepository;
import com.epathshala.repository.StudentRepository;
import com.epathshala.repository.ParentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import com.epathshala.repository.TeacherRepository;
import com.epathshala.dto.AcademicCalendarDTO;
import com.epathshala.entity.AcademicCalendar;
import com.epathshala.repository.AcademicCalendarRepository;
import com.epathshala.repository.AttendanceRepository;
import com.epathshala.repository.GradeRepository;
import com.epathshala.repository.LeaveRequestRepository;
import com.epathshala.entity.Teacher;

@Service
public class AdminService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ParentRepository parentRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private AcademicCalendarRepository academicCalendarRepository;
    @Autowired
    private AttendanceRepository attendanceRepository;
    @Autowired
    private GradeRepository gradeRepository;
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    public Map<String, Object> addStudent(UserDTO dto) {
        // Create User for Student
        User studentUser = new User();
        studentUser.setName(dto.getName());
        studentUser.setEmail(dto.getEmail());
        studentUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        studentUser.setRole("STUDENT");
        studentUser.setAccountNumber(UUID.randomUUID().toString());
        userRepository.save(studentUser);

        // Link to Parent (existing or new)
        Parent parent = null;
        if (dto.getParentId() != null) {
            parent = parentRepository.findById(dto.getParentId()).orElse(null);
        } else {
            // Create new parent user and parent entity
            User parentUser = new User();
            parentUser.setName(dto.getName() + "'s Parent");
            parentUser.setEmail(dto.getEmail() + ".parent"); // You may want a better logic for parent email
            parentUser.setPassword(passwordEncoder.encode("parent123")); // Default password, should be changed
            parentUser.setRole("PARENT");
            parentUser.setAccountNumber(UUID.randomUUID().toString());
            userRepository.save(parentUser);

            parent = new Parent();
            parent.setUser(parentUser);
            parentRepository.save(parent);
        }

        // Create Student entity
        Student student = new Student();
        student.setUser(studentUser);
        student.setStudentClass(dto.getStudentClass());
        student.setParent(parent);
        studentRepository.save(student);

        return Map.of("studentId", student.getId(), "parentId", parent != null ? parent.getId() : null);
    }
    public Map<String, Object> addTeacher(UserDTO dto) {
        // Create User for Teacher
        User teacherUser = new User();
        teacherUser.setName(dto.getName());
        teacherUser.setEmail(dto.getEmail());
        teacherUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        teacherUser.setRole("TEACHER");
        teacherUser.setAccountNumber(UUID.randomUUID().toString());
        userRepository.save(teacherUser);

        // Create Teacher entity
        com.epathshala.entity.Teacher teacher = new com.epathshala.entity.Teacher();
        teacher.setUser(teacherUser);
        teacher.setSubject(dto.getSubject());
        teacher.setAssignedClass(dto.getAssignedClass());
        // Save teacher (need TeacherRepository)
        if (teacherRepository != null) {
            teacherRepository.save(teacher);
        }

        return Map.of("teacherId", teacher.getId());
    }
    public Map<String, Object> addParent(UserDTO dto) {
        // Create User for Parent
        User parentUser = new User();
        parentUser.setName(dto.getName());
        parentUser.setEmail(dto.getEmail());
        parentUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        parentUser.setRole("PARENT");
        parentUser.setAccountNumber(UUID.randomUUID().toString());
        userRepository.save(parentUser);

        // Link to Student
        Student student = null;
        if (dto.getStudentId() != null) {
            student = studentRepository.findById(dto.getStudentId()).orElse(null);
        }

        Parent parent = new Parent();
        parent.setUser(parentUser);
        parentRepository.save(parent);

        // Link student to parent if student exists
        if (student != null) {
            student.setParent(parent);
            studentRepository.save(student);
        }

        return Map.of("parentId", parent.getId(), "studentId", student != null ? student.getId() : null);
    }
    public List<UserListDTO> getAllStudents() {
        return studentRepository.findAll().stream()
            .map(student -> new UserListDTO(
                student.getId(),
                student.getUser().getName(),
                student.getUser().getEmail(),
                student.getUser().getRole(),
                student.getStudentClass(),
                null,
                null
            ))
            .collect(Collectors.toList());
    }
    
    public List<UserListDTO> getAllTeachers() {
        return teacherRepository.findAll().stream()
            .map(teacher -> new UserListDTO(
                teacher.getId(),
                teacher.getUser().getName(),
                teacher.getUser().getEmail(),
                teacher.getUser().getRole(),
                null,
                teacher.getSubject(),
                teacher.getAssignedClass()
            ))
            .collect(Collectors.toList());
    }
    
    public List<UserListDTO> getAllParents() {
        return parentRepository.findAll().stream()
            .map(parent -> new UserListDTO(
                parent.getId(),
                parent.getUser().getName(),
                parent.getUser().getEmail(),
                parent.getUser().getRole(),
                null,
                null,
                null
            ))
            .collect(Collectors.toList());
    }
    public void deleteUser(Long id) {
        // Find the user first
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found with ID: " + id);
        }
        
        // Delete associated entities based on user role
        switch (user.getRole()) {
            case "STUDENT":
                Student student = studentRepository.findAll().stream()
                    .filter(s -> s.getUser().getId().equals(id))
                    .findFirst().orElse(null);
                if (student != null) {
                    // Delete associated records
                    attendanceRepository.deleteAll(attendanceRepository.findAll().stream()
                        .filter(a -> a.getStudent() != null && a.getStudent().getId().equals(student.getId()))
                        .collect(Collectors.toList()));
                    gradeRepository.deleteAll(gradeRepository.findAll().stream()
                        .filter(g -> g.getStudent() != null && g.getStudent().getId().equals(student.getId()))
                        .collect(Collectors.toList()));
                    leaveRequestRepository.deleteAll(leaveRequestRepository.findAll().stream()
                        .filter(l -> l.getStudent() != null && l.getStudent().getId().equals(student.getId()))
                        .collect(Collectors.toList()));
                    studentRepository.delete(student);
                }
                break;
                
            case "TEACHER":
                Teacher teacher = teacherRepository.findAll().stream()
                    .filter(t -> t.getUser().getId().equals(id))
                    .findFirst().orElse(null);
                if (teacher != null) {
                    // Delete associated records
                    attendanceRepository.deleteAll(attendanceRepository.findAll().stream()
                        .filter(a -> a.getMarkedBy() != null && a.getMarkedBy().getId().equals(teacher.getId()))
                        .collect(Collectors.toList()));
                    gradeRepository.deleteAll(gradeRepository.findAll().stream()
                        .filter(g -> g.getTeacher() != null && g.getTeacher().getId().equals(teacher.getId()))
                        .collect(Collectors.toList()));
                    teacherRepository.delete(teacher);
                }
                break;
                
            case "PARENT":
                Parent parent = parentRepository.findAll().stream()
                    .filter(p -> p.getUser().getId().equals(id))
                    .findFirst().orElse(null);
                if (parent != null) {
                    parentRepository.delete(parent);
                }
                break;
                
            default:
                // For ADMIN or other roles, just delete the user
                break;
        }
        
        // Finally delete the user
        userRepository.delete(user);
    }
    public Map<String, Object> assignTeacher(UserDTO dto) {
        // Find teacher by id (or email)
        com.epathshala.entity.Teacher teacher = null;
        if (dto.getEmail() != null) {
            User user = userRepository.findByEmail(dto.getEmail()).orElse(null);
            if (user != null) {
                teacher = teacherRepository.findAll().stream()
                    .filter(t -> t.getUser().getId().equals(user.getId()))
                    .findFirst().orElse(null);
            }
        }
        // Optionally, you can use a teacherId field in UserDTO for direct lookup
        if (teacher == null) {
            return Map.of("error", "Teacher not found");
        }
        teacher.setAssignedClass(dto.getAssignedClass());
        teacher.setSubject(dto.getSubject());
        teacherRepository.save(teacher);
        return Map.of("teacherId", teacher.getId(), "assignedClass", teacher.getAssignedClass(), "subject", teacher.getSubject());
    }

    public Map<String, Object> addEvent(AcademicCalendarDTO dto) {
        AcademicCalendar event = new AcademicCalendar();
        event.setEventName(dto.getEventName());
        event.setDate(dto.getDate());
        event.setDescription(dto.getDescription());
        academicCalendarRepository.save(event);
        return Map.of("eventId", event.getId());
    }

    public List<AcademicCalendar> getEvents() {
        return academicCalendarRepository.findAll();
    }

    public void deleteEvent(Long eventId) {
        academicCalendarRepository.deleteById(eventId);
    }

    public Map<String, Object> getDashboardSummary() {
        long studentCount = studentRepository.count();
        long teacherCount = teacherRepository.count();
        long parentCount = parentRepository.count();
        long eventCount = academicCalendarRepository.count();
        return Map.of(
            "students", studentCount,
            "teachers", teacherCount,
            "parents", parentCount,
            "events", eventCount
        );
    }
}