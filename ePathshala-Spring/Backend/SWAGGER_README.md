# Swagger/OpenAPI Documentation for ePathshala

## Overview
This project includes comprehensive API documentation using Swagger/OpenAPI 3.0 with SpringDoc.

## Accessing Swagger UI

### Development Environment
- **Swagger UI URL:** `http://localhost:8081/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:8081/api-docs`
- **OpenAPI YAML:** `http://localhost:8081/api-docs.yaml`

### Production Environment
- **Swagger UI URL:** `https://api.epathshala.com/swagger-ui.html`
- **OpenAPI JSON:** `https://api.epathshala.com/api-docs`

## Features

### 🔐 **Authentication APIs**
- User Login
- Forgot Password
- Reset Password

### 👨‍💼 **Admin Management APIs**
- Add/Get/Delete Students
- Add/Get/Delete Teachers
- Add/Get/Delete Parents
- Assign Teachers to Classes
- Academic Calendar Management
- Dashboard Summary

### 👨‍🏫 **Teacher APIs**
- Mark/View Attendance
- Enter/View Grades
- Upload/View Assignments
- Approve Leave Requests

### 👨‍🎓 **Student APIs**
- View Attendance
- View Grades
- View Assignments
- Submit Leave Requests
- Check Leave Status

### 👨‍👩‍👧‍👦 **Parent APIs**
- View Child's Attendance
- View Child's Grades
- Approve Leave Requests

## Configuration

### Security
- JWT Bearer Token authentication
- Role-based access control (ADMIN, TEACHER, STUDENT, PARENT)
- Swagger UI endpoints are publicly accessible

### Customization
The Swagger configuration can be modified in:
- `SwaggerConfig.java` - Main configuration
- `application.properties` - Swagger properties
- Controller annotations - API documentation

## API Testing

### Using Swagger UI
1. Open `http://localhost:8081/swagger-ui.html`
2. Click "Authorize" button to add JWT token
3. Enter token in format: `Bearer <your-jwt-token>`
4. Test any API endpoint directly from the UI

### Getting JWT Token
1. Use the `/api/auth/login` endpoint
2. Provide email, password, and role
3. Copy the returned token
4. Use it in the Authorize dialog

## Dependencies
- `springdoc-openapi-ui:1.6.15`
- `springdoc-openapi-security:1.6.15`

## Notes
- Swagger UI is automatically generated from controller annotations
- All endpoints are documented with descriptions and examples
- Security schemes are configured for JWT authentication
- The documentation is always up-to-date with the code