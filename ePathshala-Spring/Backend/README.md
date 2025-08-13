# ePathshala Backend

A Spring Boot backend application for the ePathshala Educational Management System.

## Prerequisites

- Java 11 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

## Setup Instructions

### 1. Database Setup

1. Install MySQL if not already installed
2. Create a new database:
   ```sql
   CREATE DATABASE epathshalaAI;
   ```
3. Update database credentials in `src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```

### 2. Build and Run

1. **Compile the project:**
   ```bash
   mvn clean compile
   ```

2. **Build the project:**
   ```bash
   mvn clean install -DskipTests
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

   Or run the JAR file:
   ```bash
   java -jar target/epathshala-backend-0.0.1-SNAPSHOT.jar
   ```

### 3. API Endpoints

The application will start on `http://localhost:8080`

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

#### Admin Endpoints
- `POST /api/admin/students` - Add student
- `POST /api/admin/teachers` - Add teacher
- `POST /api/admin/parents` - Add parent
- `GET /api/admin/dashboard` - Dashboard summary
- `POST /api/admin/calendar` - Add academic event
- `GET /api/admin/calendar` - Get all events

#### Teacher Endpoints
- `POST /api/teacher/attendance` - Mark attendance
- `GET /api/teacher/attendance/{className}` - Get attendance by class
- `POST /api/teacher/grades` - Enter grades
- `GET /api/teacher/grades/{className}` - Get grades by class
- `POST /api/teacher/assignments` - Upload assignment
- `GET /api/teacher/assignments/{className}` - Get assignments by class
- `POST /api/teacher/assignments/upload` - Upload assignment file
- `GET /api/teacher/leaves/{className}` - Get leave requests by class
- `POST /api/teacher/leaves/approve` - Approve/reject leave

#### Student Endpoints
- `GET /api/student/attendance` - Get attendance
- `GET /api/student/grades` - Get grades
- `GET /api/student/assignments/{className}` - Get assignments
- `POST /api/student/leaves` - Submit leave request
- `GET /api/student/leaves` - Get leave status

#### Parent Endpoints
- `GET /api/parent/attendance` - Get child's attendance
- `GET /api/parent/grades` - Get child's grades
- `POST /api/parent/leaves/approve` - Approve/reject leave

#### WebSocket Endpoints
- `ws://localhost:8080/ws` - WebSocket connection
- `/topic/assignment` - Assignment notifications
- `/topic/leaveApproval` - Leave approval notifications

## Project Structure

```
src/main/java/com/epathshala/
├── EpathshalaApplication.java          # Main application class
├── config/
│   ├── SecurityConfig.java            # Spring Security configuration
│   └── WebSocketConfig.java           # WebSocket configuration
├── controller/
│   ├── AdminController.java           # Admin endpoints
│   ├── AuthController.java            # Authentication endpoints
│   ├── NotificationController.java    # WebSocket notifications
│   ├── ParentController.java          # Parent endpoints
│   ├── StudentController.java         # Student endpoints
│   └── TeacherController.java         # Teacher endpoints
├── dto/
│   ├── AcademicCalendarDTO.java       # Calendar data transfer objects
│   ├── AssignmentDTO.java             # Assignment DTOs
│   ├── AttendanceDTO.java             # Attendance DTOs
│   ├── GradeDTO.java                  # Grade DTOs
│   ├── LeaveApprovalDTO.java          # Leave approval DTOs
│   ├── LeaveRequestDTO.java           # Leave request DTOs
│   ├── LoginRequest.java              # Login DTOs
│   └── UserDTO.java                   # User DTOs
├── entity/
│   ├── AcademicCalendar.java          # Calendar entity
│   ├── Assignment.java                # Assignment entity
│   ├── Attendance.java                # Attendance entity
│   ├── Grade.java                     # Grade entity
│   ├── LeaveRequest.java              # Leave request entity
│   ├── Parent.java                    # Parent entity
│   ├── Student.java                   # Student entity
│   ├── Teacher.java                   # Teacher entity
│   └── User.java                      # User entity
├── repository/
│   ├── AcademicCalendarRepository.java # Calendar repository
│   ├── AssignmentRepository.java      # Assignment repository
│   ├── AttendanceRepository.java      # Attendance repository
│   ├── GradeRepository.java           # Grade repository
│   ├── LeaveRequestRepository.java    # Leave request repository
│   ├── ParentRepository.java          # Parent repository
│   ├── StudentRepository.java         # Student repository
│   ├── TeacherRepository.java         # Teacher repository
│   └── UserRepository.java            # User repository
├── security/
│   ├── CustomUserDetailsService.java  # Custom user details service
│   ├── JwtFilter.java                 # JWT authentication filter
│   └── JwtUtil.java                   # JWT utility class
└── service/
    ├── AdminService.java              # Admin business logic
    ├── AuthService.java               # Authentication service
    ├── ParentService.java             # Parent business logic
    ├── StudentService.java            # Student business logic
    └── TeacherService.java            # Teacher business logic
```

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Admin can create and manage students, teachers, and parents
- **Attendance Management**: Teachers can mark and view attendance
- **Grade Management**: Teachers can enter and view grades
- **Assignment Management**: Teachers can upload assignments with file support
- **Leave Management**: Students can submit leave requests, teachers and parents can approve
- **Academic Calendar**: Admin can manage academic events
- **Real-time Notifications**: WebSocket-based notifications for assignments and leave approvals
- **File Upload**: Support for assignment file uploads
- **Password Reset**: Forgot password functionality

## Security

- JWT-based authentication
- Role-based authorization (ADMIN, STUDENT, TEACHER, PARENT)
- Password encryption using BCrypt
- CORS configuration for frontend integration

## Database

The application uses MySQL with the following main entities:
- **User**: Base user information and authentication
- **Student**: Student-specific information linked to User
- **Teacher**: Teacher-specific information linked to User
- **Parent**: Parent information linked to Student
- **Attendance**: Student attendance records
- **Grade**: Student grade records
- **Assignment**: Assignment information with file support
- **LeaveRequest**: Student leave requests with approval workflow
- **AcademicCalendar**: Academic events and calendar

## Development

### Running Tests
```bash
mvn test
```

### Running with Profile
```bash
mvn spring-boot:run -Dspring.profiles.active=dev
```

### Building for Production
```bash
mvn clean package -DskipTests
```

## Configuration

Key configuration properties in `application.properties`:
- Database connection settings
- JWT secret key
- JPA/Hibernate settings
- Server port (default: 8080)

## API Documentation

The application provides RESTful APIs with the following patterns:
- All endpoints are prefixed with `/api`
- Role-based endpoints (e.g., `/api/admin/`, `/api/teacher/`)
- JSON request/response format
- JWT token required in Authorization header for protected endpoints

## Troubleshooting

1. **Database Connection Error**: Ensure MySQL is running and database exists
2. **Port Already in Use**: Change server.port in application.properties
3. **JWT Token Issues**: Check jwt.secret configuration
4. **File Upload Issues**: Ensure uploads directory has write permissions

## Support

For issues and questions, please refer to the project documentation or create an issue in the repository.