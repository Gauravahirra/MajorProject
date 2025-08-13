package com.epathshala.repository;

import com.epathshala.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    
    // Find assignments by class name
    List<Assignment> findByClassNameOrderByCreatedAtDesc(String className);
    
    // Find assignments by teacher
    List<Assignment> findByTeacherIdOrderByCreatedAtDesc(Long teacherId);
    
    // Find all assignments ordered by creation date
    List<Assignment> findAllByOrderByCreatedAtDesc();
    
    // Find assignments by subject
    List<Assignment> findBySubjectOrderByCreatedAtDesc(String subject);
    
    // Find assignments by class and subject
    List<Assignment> findByClassNameAndSubjectOrderByCreatedAtDesc(String className, String subject);
}