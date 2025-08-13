# ePathshala Backend Documentation

## 📁 Project Structure

```
epathshala/
├── src/main/java/com/epathshala/
│   ├── config/           # Configuration classes
│   ├── controller/       # REST API controllers
│   ├── dto/             # Data Transfer Objects
│   ├── entity/          # JPA entities
│   ├── interceptor/     # Request interceptors
│   ├── repository/      # Data access layer
│   ├── security/        # Security configuration
│   ├── service/         # Business logic layer
│   └── util/           # Utility classes
├── src/main/resources/
│   ├── application.properties
│   ├── data.sql
│   └── add_questions.sql
└── pom.xml
```

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### Setup
```bash
cd epathshala
mvn clean install
mvn spring-boot:run
```

## 🏗️ Architecture

### Technology Stack
- **Spring Boot 3.x** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Data persistence
- **MySQL** - Database
- **JWT** - Token-based authentication
- **WebSocket** - Real-time communication

### Key Patterns
- **Layered Architecture**: Controller → Service → Repository
- **RESTful API Design**
- **DTO Pattern** for data transfer
- **Repository Pattern** for data access

## 📊 Core Entities

### User Management
- **User** - Base user entity with email, password, role
- **Student** - Student-specific data (class, roll number)
- **Teacher** - Teacher-specific data (subject, qualification)
- **Parent** - Parent entity linked to students

### Academic Management
- **Attendance** - Student attendance tracking
- **Grade** - Student grades and marks
- **Assignment** - Teacher assignments
- **AssignmentSubmission** - Student submissions
- **LeaveRequest** - Student leave requests
- **AcademicCalendar** - Academic events

### Communication
- **ChatMessage** - Chat messages between users
- **ChatRoom** - Chat room entities
- **Notification** - System notifications

### Exam Management
- **Exam** - Exam definitions
- **ExamQuestion** - Exam questions
- **ExamAttempt** - Student exam attempts
- **ExamAnswer** - Student answers

## 🎮 Controllers

### Authentication (`AuthController.java`)
**Endpoints**:
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset
- `POST /api/auth/verify-otp` - OTP verification

### Teacher (`TeacherController.java`)
**Endpoints**:
- `POST /api/teacher/attendance` - Mark attendance
- `POST /api/teacher/grades` - Add grades
- `POST /api/teacher/assignments` - Create assignments
- `PUT /api/teacher/leave-requests/{id}` - Approve/reject leave

### Student (`StudentController.java`)
**Endpoints**:
- `GET /api/student/assignments` - Get assignments
- `POST /api/student/assignments/{id}/submit` - Submit assignment
- `GET /api/student/grades` - Get grades
- `POST /api/student/leave-requests` - Submit leave request

### Parent (`ParentController.java`)
**Endpoints**:
- `GET /api/parent/child-progress` - Get child progress
- `GET /api/parent/child-attendance` - Get child attendance
- `PUT /api/parent/leave-requests/{id}` - Approve leave

### Admin (`AdminController.java`)
**Endpoints**:
- `POST /api/admin/users` - Create user
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user

### Communication
- **ChatController** - Chat functionality
- **WebSocketChatController** - Real-time chat
- **NotificationController** - Notifications

### Exams
- **FacultyExamController** - Exam creation/management
- **StudentExamController** - Exam taking

## 🏢 Services

### Core Services
- **AuthService** - Authentication logic
- **TeacherService** - Teacher operations
- **StudentService** - Student operations
- **ParentService** - Parent operations
- **AdminService** - Admin operations
- **ExamService** - Exam management
- **ChatService** - Chat functionality
- **NotificationService** - Notifications

### Service Methods Examples
```java
// TeacherService
public Attendance markAttendance(AttendanceDTO dto)
public Grade addGrade(GradeDTO dto)
public Assignment createAssignment(AssignmentDTO dto)

// StudentService
public List<Assignment> getMyAssignments()
public AssignmentSubmission submitAssignment(Long id, MultipartFile file)
public List<Grade> getMyGrades()

// ParentService
public ParentDashboardDTO getChildProgress()
public LeaveRequest approveLeaveRequest(Long id, LeaveApprovalDTO dto)
```

## 📊 Repositories

### Key Repository Interfaces
- **UserRepository** - User data access
- **StudentRepository** - Student data access
- **TeacherRepository** - Teacher data access
- **AttendanceRepository** - Attendance data access
- **GradeRepository** - Grade data access
- **AssignmentRepository** - Assignment data access
- **LeaveRequestRepository** - Leave request data access
- **ExamRepository** - Exam data access

### Repository Methods Examples
```java
// UserRepository
Optional<User> findByEmail(String email)
List<User> findByRole(Role role)

// AttendanceRepository
List<Attendance> findByStudentId(Long studentId)
Optional<Attendance> findByStudentIdAndDate(Long studentId, LocalDate date)

// GradeRepository
List<Grade> findByStudentId(Long studentId)
Double getAverageGradeByStudent(Long studentId)
```

## 🔐 Security

### Security Configuration (`SecurityConfig.java`)
- JWT authentication filter
- CORS configuration
- Role-based access control
- Public endpoint configuration

### JWT Implementation
- **JwtUtil** - Token generation/validation
- **JwtFilter** - Request filtering
- **CustomUserDetailsService** - User details service

### Security Features
- Password hashing with BCrypt
- JWT token-based authentication
- Role-based authorization
- Session management
- Input validation

## 📝 DTOs (Data Transfer Objects)

### Authentication DTOs
- **LoginRequest** - Login credentials
- **LoginResponse** - Login response with token
- **ForgotPasswordRequest** - Password reset
- **VerifyOtpRequest** - OTP verification

### Dashboard DTOs
- **TeacherDashboardDTO** - Teacher dashboard data
- **StudentDashboardDTO** - Student dashboard data
- **ParentDashboardDTO** - Parent dashboard data

### Academic DTOs
- **AttendanceDTO** - Attendance data
- **GradeDTO** - Grade data
- **AssignmentDTO** - Assignment data
- **LeaveRequestDTO** - Leave request data

### Communication DTOs
- **ChatMessageDTO** - Chat message data
- **NotificationDTO** - Notification data

### Exam DTOs
- **ExamDTO** - Exam data
- **ExamQuestionDTO** - Question data
- **ExamResultDTO** - Result data

## 🔧 Configuration

### Application Properties
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/epathshala
spring.datasource.username=root
spring.datasource.password=password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Server
server.port=8080
```

### Configuration Classes
- **SecurityConfig** - Security configuration
- **WebSocketConfig** - WebSocket setup
- **SwaggerConfig** - API documentation
- **DataInitializer** - Sample data initialization

## 🛠️ Utilities

### Password Utilities
- **PasswordUtility** - Password hashing/verification
- **StandalonePasswordVerifier** - Password validation

### Interceptors
- **SessionInterceptor** - Session management
- **WebSocketInterceptor** - WebSocket handling

## 📋 API Endpoints Summary

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-otp`

### Teacher Operations
- `GET /api/teacher/dashboard`
- `POST /api/teacher/attendance`
- `POST /api/teacher/grades`
- `POST /api/teacher/assignments`
- `PUT /api/teacher/leave-requests/{id}`

### Student Operations
- `GET /api/student/dashboard`
- `GET /api/student/assignments`
- `POST /api/student/assignments/{id}/submit`
- `GET /api/student/grades`
- `POST /api/student/leave-requests`

### Parent Operations
- `GET /api/parent/dashboard`
- `GET /api/parent/child-progress`
- `PUT /api/parent/leave-requests/{id}`

### Admin Operations
- `POST /api/admin/users`
- `GET /api/admin/users`
- `PUT /api/admin/users/{id}`
- `DELETE /api/admin/users/{id}`

### Communication
- `GET /api/chat/messages/{userId}`
- `POST /api/chat/messages`
- `GET /api/chat/users`

### Exams
- `POST /api/faculty/exams`
- `POST /api/faculty/exams/{id}/questions`
- `GET /api/student/exams/available`
- `POST /api/student/exams/{id}/start`
- `POST /api/student/exams/{id}/submit`

## 🔒 Security Features

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control (ADMIN, TEACHER, STUDENT, PARENT)
- Password hashing with BCrypt
- Session management

### Data Protection
- Input validation
- SQL injection prevention
- XSS protection
- Secure file upload

## 📊 Database Schema

### Core Tables
- **users** - Base user information
- **students** - Student-specific data
- **teachers** - Teacher-specific data
- **parents** - Parent data
- **attendance** - Attendance records
- **grades** - Grade records
- **assignments** - Assignment data
- **assignment_submissions** - Submission data
- **leave_requests** - Leave request data
- **academic_calendar** - Calendar events
- **chat_messages** - Chat messages
- **exams** - Exam data
- **exam_questions** - Question data
- **exam_attempts** - Attempt data
- **exam_answers** - Answer data

## 🚀 Deployment

### Production Setup
1. Build: `mvn clean package`
2. Configure production database
3. Set environment variables
4. Deploy JAR file
5. Configure reverse proxy

### Docker Deployment
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/epathshala-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 📈 Performance & Monitoring

### Optimizations
- Database indexing
- Connection pooling
- Query optimization
- Response compression

### Monitoring
- Health check endpoints
- Performance metrics
- Error tracking
- Activity logging

---

**Last Updated**: August 2024
**Version**: 1.0.0
**Maintainer**: ePathshala Development Team
