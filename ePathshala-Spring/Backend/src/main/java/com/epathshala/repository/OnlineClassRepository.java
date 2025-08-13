package com.epathshala.repository;

import com.epathshala.entity.OnlineClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OnlineClassRepository extends JpaRepository<OnlineClass, Long> {
    
    // Find all classes by teacher
    List<OnlineClass> findByTeacherIdOrderByScheduledTimeDesc(Long teacherId);
    
    // Find classes by status
    List<OnlineClass> findByStatusOrderByScheduledTimeDesc(String status);
    
    // Find active classes
    @Query("SELECT oc FROM OnlineClass oc WHERE oc.status = 'active'")
    List<OnlineClass> findActiveClasses();
    
    // Find scheduled classes
    @Query("SELECT oc FROM OnlineClass oc WHERE oc.status = 'scheduled' AND oc.scheduledTime > :now")
    List<OnlineClass> findUpcomingClasses(@Param("now") LocalDateTime now);
    
    // Find classes by teacher and status
    List<OnlineClass> findByTeacherIdAndStatusOrderByScheduledTimeDesc(Long teacherId, String status);
    
    // Find classes scheduled between two dates
    @Query("SELECT oc FROM OnlineClass oc WHERE oc.scheduledTime BETWEEN :startDate AND :endDate")
    List<OnlineClass> findClassesBetweenDates(@Param("startDate") LocalDateTime startDate, 
                                            @Param("endDate") LocalDateTime endDate);
    
    // Find classes by room ID
    OnlineClass findByRoomId(String roomId);
    
    // Count active classes by teacher
    @Query("SELECT COUNT(oc) FROM OnlineClass oc WHERE oc.teacher.id = :teacherId AND oc.status = 'active'")
    Long countActiveClassesByTeacher(@Param("teacherId") Long teacherId);
    
    // Find classes with participants count
    @Query("SELECT oc FROM OnlineClass oc WHERE oc.currentParticipants < oc.maxParticipants")
    List<OnlineClass> findAvailableClasses();
    
    // Find all classes ordered by scheduled time
    List<OnlineClass> findAllByOrderByScheduledTimeDesc();
} 