package com.epathshala.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserListDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String studentClass; // for students
    private String subject; // for teachers
    private String assignedClass; // for teachers
} 