package com.epathshala.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String name;
    private String email;
    private String password;
    private String role;
    private String studentClass; // for students
    private String subject; // for teachers
    private String assignedClass; // for teachers
    private Long parentId; // for students
    private Long studentId; // for parents
}