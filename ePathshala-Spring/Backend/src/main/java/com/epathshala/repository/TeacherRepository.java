package com.epathshala.repository;

import com.epathshala.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    @Query("SELECT t FROM Teacher t WHERE t.user.id = :userId")
    Optional<Teacher> findByUser_Id(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Teacher t JOIN t.user u WHERE u.id = :userId")
    Optional<Teacher> findByUser(@Param("userId") Long userId);
    
    List<Teacher> findBySubject(String subject);
    
    List<Teacher> findByAssignedClass(String assignedClass);
}