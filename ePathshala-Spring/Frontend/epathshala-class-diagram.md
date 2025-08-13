# ePathshala Class Diagram

## Complete System Class Diagram

```mermaid
classDiagram
    %% User Management Classes
    class User {
        +Long id
        +String email
        +String password
        +String name
        +Role role
        +String phone
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +boolean isActive
        +authenticate(password)
        +updateProfile(profileData)
        +changePassword(oldPassword, newPassword)
    }

    class Student {
        +Long id
        +Long userId
        +String rollNumber
        +String className
        +String section
        +LocalDate dateOfBirth
        +String address
        +String parentPhone
        +getAttendance()
        +getGrades()
        +getAssignments()
        +submitAssignment(assignmentId, file)
        +requestLeave(leaveRequest)
    }

    class Teacher {
        +Long id
        +Long userId
        +String employeeId
        +String subject
        +String qualification
        +String experience
        +String department
        +markAttendance(attendanceData)
        +addGrade(gradeData)
        +createAssignment(assignmentData)
        +approveLeaveRequest(requestId, status)
        +createExam(examData)
    }

    class Parent {
        +Long id
        +Long userId
        +String occupation
        +String address
        +List~Student~ children
        +getChildProgress(studentId)
        +getChildAttendance(studentId)
        +approveLeaveRequest(requestId)
        +sendMessage(teacherId, message)
    }

    class Admin {
        +Long id
        +Long userId
        +String designation
        +String department
        +createUser(userData)
        +updateUser(userId, userData)
        +deleteUser(userId)
        +manageAcademicCalendar()
        +generateReports()
    }

    %% Academic Management Classes
    class Attendance {
        +Long id
        +Long studentId
        +Long teacherId
        +LocalDate date
        +AttendanceStatus status
        +String remarks
        +LocalDateTime markedAt
        +markAttendance()
        +updateAttendance()
        +getAttendanceReport()
    }

    class Grade {
        +Long id
        +Long studentId
        +Long teacherId
        +String subject
        +Double marks
        +String grade
        +String remarks
        +LocalDate examDate
        +LocalDateTime createdAt
        +addGrade()
        +updateGrade()
        +calculateGrade()
    }

    class Assignment {
        +Long id
        +Long teacherId
        +String title
        +String description
        +String subject
        +String className
        +LocalDateTime dueDate
        +String fileUrl
        +AssignmentStatus status
        +LocalDateTime createdAt
        +createAssignment()
        +updateAssignment()
        +deleteAssignment()
        +getSubmissions()
    }

    class AssignmentSubmission {
        +Long id
        +Long assignmentId
        +Long studentId
        +String fileUrl
        +LocalDateTime submittedAt
        +SubmissionStatus status
        +String remarks
        +submitAssignment()
        +updateSubmission()
        +gradeSubmission(marks, feedback)
    }

    class LeaveRequest {
        +Long id
        +Long studentId
        +Long teacherId
        +Long parentId
        +LocalDate fromDate
        +LocalDate toDate
        +String reason
        +LeaveStatus status
        +String remarks
        +LocalDateTime createdAt
        +submitRequest()
        +approveRequest()
        +rejectRequest()
        +updateStatus()
    }

    class AcademicCalendar {
        +Long id
        +String title
        +String description
        +LocalDate date
        +EventType type
        +String location
        +boolean isHoliday
        +LocalDateTime createdAt
        +createEvent()
        +updateEvent()
        +deleteEvent()
        +getEventsByDateRange()
    }

    %% Communication Classes
    class ChatMessage {
        +Long id
        +Long senderId
        +Long receiverId
        +String message
        +MessageType type
        +String fileUrl
        +boolean isRead
        +LocalDateTime sentAt
        +sendMessage()
        +markAsRead()
        +deleteMessage()
    }

    class ChatRoom {
        +Long id
        +String name
        +ChatRoomType type
        +List~User~ participants
        +LocalDateTime createdAt
        +createRoom()
        +addParticipant(userId)
        +removeParticipant(userId)
        +getMessages()
    }

    class Notification {
        +Long id
        +Long userId
        +String title
        +String message
        +NotificationType type
        +boolean isRead
        +String targetUrl
        +LocalDateTime createdAt
        +sendNotification()
        +markAsRead()
        +deleteNotification()
    }

    %% Exam Management Classes
    class Exam {
        +Long id
        +Long teacherId
        +String title
        +String description
        +String subject
        +String className
        +LocalDateTime startTime
        +LocalDateTime endTime
        +Integer duration
        +Integer totalMarks
        +ExamStatus status
        +LocalDateTime createdAt
        +createExam()
        +updateExam()
        +publishExam()
        +getQuestions()
        +getResults()
    }

    class ExamQuestion {
        +Long id
        +Long examId
        +String question
        +QuestionType type
        +List~String~ options
        +String correctAnswer
        +Integer marks
        +Integer order
        +addQuestion()
        +updateQuestion()
        +deleteQuestion()
    }

    class ExamAttempt {
        +Long id
        +Long examId
        +Long studentId
        +LocalDateTime startTime
        +LocalDateTime endTime
        +Integer score
        +AttemptStatus status
        +startExam()
        +submitExam()
        +calculateScore()
    }

    class ExamAnswer {
        +Long id
        +Long attemptId
        +Long questionId
        +String answer
        +boolean isCorrect
        +Integer marksObtained
        +saveAnswer()
        +gradeAnswer()
    }

    %% DTO Classes
    class LoginRequest {
        +String email
        +String password
        +Role role
    }

    class LoginResponse {
        +String token
        +User user
        +String message
    }

    class AssignmentDTO {
        +String title
        +String description
        +String subject
        +LocalDateTime dueDate
        +MultipartFile file
    }

    class GradeDTO {
        +Long studentId
        +String subject
        +Double marks
        +String remarks
    }

    class AttendanceDTO {
        +Long studentId
        +AttendanceStatus status
        +String remarks
    }

    %% Service Classes
    class AuthService {
        +authenticateUser(credentials)
        +generateToken(user)
        +validateToken(token)
        +forgotPassword(email)
        +resetPassword(token, newPassword)
    }

    class TeacherService {
        +markAttendance(attendanceData)
        +addGrade(gradeData)
        +createAssignment(assignmentData)
        +approveLeaveRequest(requestId, status)
        +createExam(examData)
        +getDashboardData()
    }

    class StudentService {
        +getMyAssignments()
        +submitAssignment(assignmentId, file)
        +getMyGrades()
        +requestLeave(leaveRequest)
        +takeExam(examId)
        +getDashboardData()
    }

    class ParentService {
        +getChildProgress(studentId)
        +getChildAttendance(studentId)
        +approveLeaveRequest(requestId)
        +sendMessage(teacherId, message)
        +getDashboardData()
    }

    class AdminService {
        +createUser(userData)
        +updateUser(userId, userData)
        +deleteUser(userId)
        +getAllUsers()
        +manageAcademicCalendar()
        +generateReports()
    }

    class ChatService {
        +sendMessage(messageData)
        +getMessages(userId1, userId2)
        +createChatRoom(roomData)
        +getChatRooms(userId)
    }

    class ExamService {
        +createExam(examData)
        +addQuestions(examId, questions)
        +startExam(examId, studentId)
        +submitExam(attemptId, answers)
        +gradeExam(attemptId)
        +getResults(examId)
    }

    class NotificationService {
        +sendNotification(notificationData)
        +getUserNotifications(userId)
        +markAsRead(notificationId)
        +deleteNotification(notificationId)
    }

    %% Repository Classes
    class UserRepository {
        +findByEmail(email)
        +findByRole(role)
        +findByEmailAndRole(email, role)
        +findActiveUsers()
    }

    class StudentRepository {
        +findByUserId(userId)
        +findByClassName(className)
        +findByRollNumber(rollNumber)
        +findByParentId(parentId)
    }

    class TeacherRepository {
        +findByUserId(userId)
        +findBySubject(subject)
        +findByDepartment(department)
        +findActiveTeachers()
    }

    class AttendanceRepository {
        +findByStudentId(studentId)
        +findByStudentIdAndDate(studentId, date)
        +findByTeacherId(teacherId)
        +getAttendanceReport(studentId, startDate, endDate)
    }

    class GradeRepository {
        +findByStudentId(studentId)
        +findByStudentIdAndSubject(studentId, subject)
        +getAverageGradeByStudent(studentId)
        +findByTeacherId(teacherId)
    }

    class AssignmentRepository {
        +findByTeacherId(teacherId)
        +findByClassName(className)
        +findBySubject(subject)
        +findActiveAssignments()
    }

    class ExamRepository {
        +findByTeacherId(teacherId)
        +findByClassName(className)
        +findActiveExams()
        +findByStudentId(studentId)
    }

    %% Controller Classes
    class AuthController {
        +login(loginRequest)
        +forgotPassword(request)
        +resetPassword(request)
        +verifyOtp(request)
    }

    class TeacherController {
        +getDashboard()
        +markAttendance(attendanceDTO)
        +addGrade(gradeDTO)
        +createAssignment(assignmentDTO)
        +approveLeaveRequest(requestId, status)
        +getLeaveRequests()
    }

    class StudentController {
        +getDashboard()
        +getAssignments()
        +submitAssignment(assignmentId, file)
        +getGrades()
        +requestLeave(leaveRequest)
        +getAttendance()
    }

    class ParentController {
        +getDashboard()
        +getChildProgress(studentId)
        +getChildAttendance(studentId)
        +approveLeaveRequest(requestId)
        +sendMessage(messageData)
    }

    class AdminController {
        +createUser(userData)
        +getAllUsers()
        +updateUser(userId, userData)
        +deleteUser(userId)
        +getSystemStats()
    }

    class ChatController {
        +sendMessage(messageData)
        +getMessages(userId1, userId2)
        +getChatRooms(userId)
        +createChatRoom(roomData)
    }

    class ExamController {
        +createExam(examData)
        +addQuestions(examId, questions)
        +getAvailableExams()
        +startExam(examId)
        +submitExam(attemptId, answers)
        +getResults(examId)
    }

    %% Frontend Component Classes
    class LoginPage {
        +state: {email, password, role, loading}
        +handleSubmit()
        +handleInputChange()
        +handleForgotPassword()
        +render()
    }

    class TeacherDashboard {
        +state: {stats, recentActivities}
        +componentDidMount()
        +fetchDashboardData()
        +handleNavigation()
        +render()
    }

    class StudentDashboard {
        +state: {assignments, grades, attendance}
        +componentDidMount()
        +fetchDashboardData()
        +handleAssignmentSubmit()
        +render()
    }

    class AssignmentManager {
        +state: {assignments, loading, selectedAssignment}
        +createAssignment()
        +updateAssignment()
        +deleteAssignment()
        +handleFileUpload()
        +render()
    }

    class ExamInterface {
        +state: {exam, questions, answers, timeLeft}
        +startExam()
        +submitAnswer()
        +submitExam()
        +handleTimeUp()
        +render()
    }

    class ChatComponent {
        +state: {messages, users, selectedUser}
        +sendMessage()
        +receiveMessage()
        +connectWebSocket()
        +render()
    }

    %% Relationships
    User ||--o{ Student : "has"
    User ||--o{ Teacher : "has"
    User ||--o{ Parent : "has"
    User ||--o{ Admin : "has"

    Student ||--o{ Attendance : "tracks"
    Student ||--o{ Grade : "receives"
    Student ||--o{ AssignmentSubmission : "submits"
    Student ||--o{ LeaveRequest : "requests"
    Student ||--o{ ExamAttempt : "takes"

    Teacher ||--o{ Attendance : "marks"
    Teacher ||--o{ Grade : "assigns"
    Teacher ||--o{ Assignment : "creates"
    Teacher ||--o{ LeaveRequest : "approves"
    Teacher ||--o{ Exam : "creates"

    Parent ||--o{ Student : "monitors"
    Parent ||--o{ LeaveRequest : "approves"

    Assignment ||--o{ AssignmentSubmission : "receives"
    Exam ||--o{ ExamQuestion : "contains"
    Exam ||--o{ ExamAttempt : "has"
    ExamAttempt ||--o{ ExamAnswer : "contains"

    ChatRoom ||--o{ ChatMessage : "contains"
    User ||--o{ ChatMessage : "sends"
    User ||--o{ Notification : "receives"

    %% Service Dependencies
    AuthController --> AuthService
    TeacherController --> TeacherService
    StudentController --> StudentService
    ParentController --> ParentService
    AdminController --> AdminService
    ChatController --> ChatService
    ExamController --> ExamService

    %% Repository Dependencies
    AuthService --> UserRepository
    TeacherService --> TeacherRepository
    TeacherService --> AttendanceRepository
    TeacherService --> GradeRepository
    TeacherService --> AssignmentRepository
    StudentService --> StudentRepository
    StudentService --> AssignmentRepository
    StudentService --> GradeRepository
    ParentService --> ParentRepository
    AdminService --> UserRepository
    ChatService --> ChatRepository
    ExamService --> ExamRepository

    %% Frontend Dependencies
    LoginPage --> AuthService
    TeacherDashboard --> TeacherService
    StudentDashboard --> StudentService
    AssignmentManager --> AssignmentService
    ExamInterface --> ExamService
    ChatComponent --> ChatService
```

## Frontend Component Hierarchy

```mermaid
classDiagram
    %% Layout Components
    class App {
        +state: {user, theme}
        +handleLogin()
        +handleLogout()
        +render()
    }

    class ProtectedRoute {
        +props: {component, role}
        +checkAuth()
        +checkRole()
        +render()
    }

    class DashboardLayout {
        +state: {sidebarOpen, user}
        +toggleSidebar()
        +handleLogout()
        +render()
    }

    class Sidebar {
        +props: {role, menuItems}
        +handleNavigation()
        +render()
    }

    class Navbar {
        +state: {user, notifications}
        +handleLogout()
        +toggleNotifications()
        +render()
    }

    %% Dashboard Components
    class TeacherDashboardLayout {
        +state: {sidebarOpen, user}
        +render()
    }

    class StudentDashboardLayout {
        +state: {sidebarOpen, user}
        +render()
    }

    class ParentDashboardLayout {
        +state: {sidebarOpen, user}
        +render()
    }

    class AdminDashboardLayout {
        +state: {sidebarOpen, user}
        +render()
    }

    %% Page Components
    class TeacherOverview {
        +state: {stats, activities}
        +fetchData()
        +render()
    }

    class StudentOverview {
        +state: {assignments, grades, attendance}
        +fetchData()
        +render()
    }

    class ParentOverview {
        +state: {children, progress}
        +fetchData()
        +render()
    }

    %% Feature Components
    class AssignmentTracker {
        +state: {assignments, loading}
        +fetchAssignments()
        +submitAssignment()
        +render()
    }

    class GradeViewer {
        +state: {grades, subjects}
        +fetchGrades()
        +calculateAverage()
        +render()
    }

    class AttendanceTracker {
        +state: {attendance, dates}
        +fetchAttendance()
        +calculatePercentage()
        +render()
    }

    class ChatInterface {
        +state: {messages, users, selectedUser}
        +sendMessage()
        +receiveMessage()
        +render()
    }

    class ExamInterface {
        +state: {exam, questions, answers, timer}
        +startExam()
        +submitAnswer()
        +submitExam()
        +render()
    }

    %% UI Components
    class LoadingSpinner {
        +props: {size, color}
        +render()
    }

    class ErrorMessage {
        +props: {message, onRetry}
        +handleRetry()
        +render()
    }

    class EmptyState {
        +props: {title, description, action}
        +handleAction()
        +render()
    }

    class NotificationBadge {
        +props: {count, onClick}
        +handleClick()
        +render()
    }

    %% Relationships
    App --> ProtectedRoute
    App --> DashboardLayout
    App --> LoginPage

    ProtectedRoute --> TeacherDashboardLayout
    ProtectedRoute --> StudentDashboardLayout
    ProtectedRoute --> ParentDashboardLayout
    ProtectedRoute --> AdminDashboardLayout

    DashboardLayout --> Sidebar
    DashboardLayout --> Navbar
    DashboardLayout --> TeacherOverview
    DashboardLayout --> StudentOverview
    DashboardLayout --> ParentOverview

    TeacherDashboardLayout --> AssignmentTracker
    TeacherDashboardLayout --> GradeViewer
    TeacherDashboardLayout --> AttendanceTracker

    StudentDashboardLayout --> AssignmentTracker
    StudentDashboardLayout --> GradeViewer
    StudentDashboardLayout --> AttendanceTracker

    ParentDashboardLayout --> GradeViewer
    ParentDashboardLayout --> AttendanceTracker

    Navbar --> NotificationBadge
    Navbar --> ChatInterface

    AssignmentTracker --> LoadingSpinner
    AssignmentTracker --> ErrorMessage
    AssignmentTracker --> EmptyState

    ExamInterface --> LoadingSpinner
    ExamInterface --> ErrorMessage
```

## Data Flow Architecture

```mermaid
classDiagram
    %% API Layer
    class ApiService {
        +baseURL: String
        +headers: Object
        +get(endpoint)
        +post(endpoint, data)
        +put(endpoint, data)
        +delete(endpoint)
        +setAuthToken(token)
    }

    class AuthAPI {
        +login(credentials)
        +logout()
        +forgotPassword(email)
        +resetPassword(token, password)
    }

    class TeacherAPI {
        +getDashboard()
        +markAttendance(data)
        +addGrade(data)
        +createAssignment(data)
        +getLeaveRequests()
    }

    class StudentAPI {
        +getDashboard()
        +getAssignments()
        +submitAssignment(id, file)
        +getGrades()
        +requestLeave(data)
    }

    class ParentAPI {
        +getDashboard()
        +getChildProgress(studentId)
        +getChildAttendance(studentId)
        +approveLeaveRequest(id)
    }

    class ChatAPI {
        +sendMessage(data)
        +getMessages(userId1, userId2)
        +getChatRooms()
    }

    class ExamAPI {
        +getAvailableExams()
        +startExam(examId)
        +submitExam(attemptId, answers)
        +getResults(examId)
    }

    %% State Management
    class AuthContext {
        +state: {user, token, isAuthenticated}
        +login(credentials)
        +logout()
        +updateUser(userData)
    }

    class ThemeContext {
        +state: {theme, mode}
        +toggleTheme()
        +setMode(mode)
    }

    class NotificationContext {
        +state: {notifications, unreadCount}
        +addNotification(notification)
        +markAsRead(id)
        +clearNotifications()
    }

    %% Hook Classes
    class useApi {
        +data: any
        +loading: boolean
        +error: string
        +execute()
        +reset()
    }

    class useAuth {
        +user: User
        +isAuthenticated: boolean
        +login()
        +logout()
        +checkAuth()
    }

    class useWebSocket {
        +connection: WebSocket
        +isConnected: boolean
        +sendMessage()
        +connect()
        +disconnect()
    }

    %% Relationships
    ApiService --> AuthAPI
    ApiService --> TeacherAPI
    ApiService --> StudentAPI
    ApiService --> ParentAPI
    ApiService --> ChatAPI
    ApiService --> ExamAPI

    AuthAPI --> AuthContext
    TeacherAPI --> useApi
    StudentAPI --> useApi
    ParentAPI --> useApi
    ChatAPI --> useWebSocket
    ExamAPI --> useApi

    AuthContext --> useAuth
    ThemeContext --> App
    NotificationContext --> App

    useApi --> ApiService
    useAuth --> AuthAPI
    useWebSocket --> ChatAPI
```

This comprehensive class diagram shows the complete structure of the ePathshala system, including:

1. **Entity Classes** - All database entities with their attributes and methods
2. **Service Classes** - Business logic layer with service methods
3. **Repository Classes** - Data access layer with query methods
4. **Controller Classes** - API endpoints and request handling
5. **DTO Classes** - Data transfer objects for API communication
6. **Frontend Components** - React components with their state and methods
7. **API Services** - Frontend API integration layer
8. **Context Classes** - React context for state management
9. **Custom Hooks** - Reusable logic hooks

The diagram also shows all the relationships between classes, including inheritance, composition, and dependencies, providing a complete view of the system architecture.
