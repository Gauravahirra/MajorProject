package com.epathshala.repository;

import com.epathshala.entity.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    
    // Find submissions by assignment
    List<AssignmentSubmission> findByAssignmentIdOrderBySubmittedAtDesc(Long assignmentId);
    
    // Find submissions by student
    List<AssignmentSubmission> findByStudentIdOrderBySubmittedAtDesc(Long studentId);
    
    // Find submission by assignment and student
    Optional<AssignmentSubmission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);
    
    // Find submissions by status
    List<AssignmentSubmission> findByStatusOrderBySubmittedAtDesc(String status);
    
    // Find late submissions
    @Query("SELECT s FROM AssignmentSubmission s WHERE s.submittedLate = true")
    List<AssignmentSubmission> findLateSubmissions();
    
    // Count submissions for an assignment
    @Query("SELECT COUNT(s) FROM AssignmentSubmission s WHERE s.assignment.id = :assignmentId")
    Long countSubmissionsByAssignment(@Param("assignmentId") Long assignmentId);
    
    // Find graded submissions
    @Query("SELECT s FROM AssignmentSubmission s WHERE s.grade IS NOT NULL")
    List<AssignmentSubmission> findGradedSubmissions();
    
    // Find ungraded submissions
    @Query("SELECT s FROM AssignmentSubmission s WHERE s.grade IS NULL")
    List<AssignmentSubmission> findUngradedSubmissions();
} 