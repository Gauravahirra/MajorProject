# ePathshala Class Diagram - Part 1: Core Entities & Controllers

## Core Entity Classes

```mermaid
classDiagram
    %% Base User Entity
    class User {
        +Long id
        +String email
        +String password
        +String firstName
        +String lastName
        +Role role
        +String phoneNumber
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +boolean isActive
        +authenticate(password)
        +updateProfile(profileData)
        +deactivate()
    }

    %% Role Enum
    class Role {
        <<enumeration>>
        ADMIN
        TEACHER
        STUDENT
        PARENT
    }

    %% Student Entity
    class Student {
        +Long id
        +User user
        +String rollNumber
        +String className
        +String section
        +Parent parent
        +LocalDate dateOfBirth
        +String address
        +String emergencyContact
        +getAttendance()
        +getGrades()
        +getAssignments()
        +submitAssignment(assignmentId, file)
        +requestLeave(leaveRequest)
    }

    %% Teacher Entity
    class Teacher {
        +Long id
        +User user
        +String employeeId
        +String qualification
        +String specialization
        +String department
        +LocalDate joiningDate
        +String experience
        +markAttendance(studentId, date, status)
        +addGrade(studentId, subject, grade)
        +createAssignment(assignmentData)
        +approveLeaveRequest(requestId, status)
        +createExam(examData)
    }

    %% Parent Entity
    class Parent {
        +Long id
        +User user
        +String relationship
        +String occupation
        +String address
        +List~Student~ children
        +getChildProgress(studentId)
        +getChildAttendance(studentId)
        +approveLeaveRequest(requestId)
        +getNotifications()
    }

    %% Academic Entities
    class Attendance {
        +Long id
        +Student student
        +Teacher teacher
        +LocalDate date
        +AttendanceStatus status
        +String remarks
        +LocalDateTime markedAt
        +markAttendance(status, remarks)
        +updateAttendance(status, remarks)
    }

    class AttendanceStatus {
        <<enumeration>>
        PRESENT
        ABSENT
        LATE
        HALF_DAY
    }

    class Grade {
        +Long id
        +Student student
        +Teacher teacher
        +String subject
        +Double marks
        +String grade
        +String remarks
        +LocalDate examDate
        +LocalDateTime createdAt
        +calculateGrade()
        +updateGrade(newMarks)
    }

    class Assignment {
        +Long id
        +Teacher teacher
        +String title
        +String description
        +String subject
        +String className
        +LocalDateTime dueDate
        +String fileUrl
        +AssignmentStatus status
        +LocalDateTime createdAt
        +createAssignment(data)
        +updateAssignment(data)
        +deleteAssignment()
        +getSubmissions()
    }

    class AssignmentStatus {
        <<enumeration>>
        DRAFT
        PUBLISHED
        CLOSED
    }

    class AssignmentSubmission {
        +Long id
        +Assignment assignment
        +Student student
        +String fileUrl
        +LocalDateTime submittedAt
        +SubmissionStatus status
        +String remarks
        +Double score
        +submitAssignment(file)
        +updateSubmission(file)
        +gradeSubmission(score, remarks)
    }

    class SubmissionStatus {
        <<enumeration>>
        SUBMITTED
        LATE
        GRADED
        OVERDUE
    }

    %% Leave Management
    class LeaveRequest {
        +Long id
        +Student student
        +Teacher teacher
        +Parent parent
        +LocalDate startDate
        +LocalDate endDate
        +String reason
        +LeaveType type
        +RequestStatus status
        +String remarks
        +LocalDateTime createdAt
        +submitRequest()
        +approveRequest(remarks)
        +rejectRequest(remarks)
    }

    class LeaveType {
        <<enumeration>>
        SICK_LEAVE
        CASUAL_LEAVE
        EMERGENCY_LEAVE
        OTHER
    }

    class RequestStatus {
        <<enumeration>>
        PENDING
        APPROVED
        REJECTED
        CANCELLED
    }

    %% Relationships
    User ||--o{ Student : "has"
    User ||--o{ Teacher : "has"
    User ||--o{ Parent : "has"
    Student ||--o{ Attendance : "tracks"
    Student ||--o{ Grade : "receives"
    Student ||--o{ AssignmentSubmission : "submits"
    Student ||--o{ LeaveRequest : "requests"
    Teacher ||--o{ Attendance : "marks"
    Teacher ||--o{ Grade : "assigns"
    Teacher ||--o{ Assignment : "creates"
    Teacher ||--o{ LeaveRequest : "approves"
    Parent ||--o{ Student : "monitors"
    Parent ||--o{ LeaveRequest : "approves"
    Assignment ||--o{ AssignmentSubmission : "receives"
```

## Controller Classes

```mermaid
classDiagram
    %% Base Controller
    class BaseController {
        +ResponseEntity~T~ success(T data)
        +ResponseEntity~T~ error(String message)
        +ResponseEntity~T~ notFound(String message)
        +ResponseEntity~T~ unauthorized(String message)
        +ResponseEntity~T~ forbidden(String message)
    }

    %% Authentication Controller
    class AuthController {
        +AuthService authService
        +ResponseEntity~LoginResponse~ login(LoginRequest request)
        +ResponseEntity~String~ forgotPassword(ForgotPasswordRequest request)
        +ResponseEntity~String~ verifyOtp(VerifyOtpRequest request)
        +ResponseEntity~String~ resetPassword(ResetPasswordRequest request)
        +ResponseEntity~String~ logout()
        +ResponseEntity~User~ getCurrentUser()
    }

    %% Teacher Controller
    class TeacherController {
        +TeacherService teacherService
        +ResponseEntity~TeacherDashboardDTO~ getDashboard()
        +ResponseEntity~List~Attendance~~ getAttendanceByDate(LocalDate date)
        +ResponseEntity~Attendance~ markAttendance(AttendanceDTO dto)
        +ResponseEntity~List~Grade~~ getGradesByStudent(Long studentId)
        +ResponseEntity~Grade~ addGrade(GradeDTO dto)
        +ResponseEntity~List~Assignment~~ getAssignments()
        +ResponseEntity~Assignment~ createAssignment(AssignmentDTO dto)
        +ResponseEntity~Assignment~ updateAssignment(Long id, AssignmentDTO dto)
        +ResponseEntity~String~ deleteAssignment(Long id)
        +ResponseEntity~List~LeaveRequest~~ getLeaveRequests()
        +ResponseEntity~LeaveRequest~ approveLeaveRequest(Long id, LeaveApprovalDTO dto)
    }

    %% Student Controller
    class StudentController {
        +StudentService studentService
        +ResponseEntity~StudentDashboardDTO~ getDashboard()
        +ResponseEntity~List~Assignment~~ getAssignments()
        +ResponseEntity~AssignmentSubmission~ submitAssignment(Long id, MultipartFile file)
        +ResponseEntity~List~Grade~~ getGrades()
        +ResponseEntity~List~Attendance~~ getAttendance()
        +ResponseEntity~LeaveRequest~ submitLeaveRequest(LeaveRequestDTO dto)
        +ResponseEntity~List~LeaveRequest~~ getLeaveRequests()
        +ResponseEntity~List~Exam~~ getAvailableExams()
        +ResponseEntity~ExamAttempt~ startExam(Long examId)
        +ResponseEntity~ExamResult~ submitExam(Long examId, ExamSubmissionDTO dto)
    }

    %% Parent Controller
    class ParentController {
        +ParentService parentService
        +ResponseEntity~ParentDashboardDTO~ getDashboard()
        +ResponseEntity~List~Student~~ getChildren()
        +ResponseEntity~ChildProgressDTO~ getChildProgress(Long studentId)
        +ResponseEntity~List~Attendance~~ getChildAttendance(Long studentId)
        +ResponseEntity~List~Grade~~ getChildGrades(Long studentId)
        +ResponseEntity~List~LeaveRequest~~ getChildLeaveRequests(Long studentId)
        +ResponseEntity~LeaveRequest~ approveLeaveRequest(Long id, LeaveApprovalDTO dto)
        +ResponseEntity~List~Notification~~ getNotifications()
    }

    %% Admin Controller
    class AdminController {
        +AdminService adminService
        +ResponseEntity~AdminDashboardDTO~ getDashboard()
        +ResponseEntity~List~User~~ getAllUsers()
        +ResponseEntity~User~ createUser(CreateUserDTO dto)
        +ResponseEntity~User~ updateUser(Long id, UpdateUserDTO dto)
        +ResponseEntity~String~ deleteUser(Long id)
        +ResponseEntity~List~Student~~ getAllStudents()
        +ResponseEntity~List~Teacher~~ getAllTeachers()
        +ResponseEntity~List~Parent~~ getAllParents()
        +ResponseEntity~Student~ assignTeacherToStudent(Long studentId, Long teacherId)
        +ResponseEntity~AcademicCalendar~ createCalendarEvent(AcademicCalendarDTO dto)
        +ResponseEntity~List~AcademicCalendar~~ getCalendarEvents()
    }

    %% Chat Controller
    class ChatController {
        +ChatService chatService
        +ResponseEntity~List~ChatMessage~~ getMessages(Long userId)
        +ResponseEntity~ChatMessage~ sendMessage(ChatMessageDTO dto)
        +ResponseEntity~List~User~~ getChatUsers()
        +ResponseEntity~List~ChatRoom~~ getChatRooms()
        +ResponseEntity~ChatRoom~ createChatRoom(ChatRoomDTO dto)
        +ResponseEntity~String~ deleteMessage(Long messageId)
    }

    %% Exam Controller
    class FacultyExamController {
        +ExamService examService
        +ResponseEntity~List~Exam~~ getExams()
        +ResponseEntity~Exam~ createExam(ExamDTO dto)
        +ResponseEntity~Exam~ updateExam(Long id, ExamDTO dto)
        +ResponseEntity~String~ deleteExam(Long id)
        +ResponseEntity~List~ExamQuestion~~ getExamQuestions(Long examId)
        +ResponseEntity~ExamQuestion~ addQuestion(Long examId, ExamQuestionDTO dto)
        +ResponseEntity~ExamQuestion~ updateQuestion(Long questionId, ExamQuestionDTO dto)
        +ResponseEntity~String~ deleteQuestion(Long questionId)
        +ResponseEntity~List~ExamResult~~ getExamResults(Long examId)
    }

    class StudentExamController {
        +ExamService examService
        +ResponseEntity~List~Exam~~ getAvailableExams()
        +ResponseEntity~Exam~ getExamDetails(Long examId)
        +ResponseEntity~ExamAttempt~ startExam(Long examId)
        +ResponseEntity~ExamResult~ submitExam(Long examId, ExamSubmissionDTO dto)
        +ResponseEntity~List~ExamResult~~ getMyExamResults()
        +ResponseEntity~ExamResult~ getExamResult(Long examId)
    }

    %% File Controller
    class FileController {
        +FileService fileService
        +ResponseEntity~String~ uploadFile(MultipartFile file)
        +ResponseEntity~Resource~ downloadFile(String fileName)
        +ResponseEntity~String~ deleteFile(String fileName)
        +ResponseEntity~List~String~~ getUploadedFiles()
    }

    %% Inheritance
    BaseController <|-- AuthController
    BaseController <|-- TeacherController
    BaseController <|-- StudentController
    BaseController <|-- ParentController
    BaseController <|-- AdminController
    BaseController <|-- ChatController
    BaseController <|-- FacultyExamController
    BaseController <|-- StudentExamController
    BaseController <|-- FileController
```
