package com.epathshala.repository;

import com.epathshala.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    
    @Query("SELECT o FROM Otp o WHERE o.email = :email AND o.isUsed = false AND o.expiresAt > :now ORDER BY o.createdAt DESC")
    List<Otp> findValidOtpsByEmail(@Param("email") String email, @Param("now") LocalDateTime now);
    
    Optional<Otp> findByEmailAndOtpAndIsUsedFalse(String email, String otp);
    
    @Query("SELECT o FROM Otp o WHERE o.email = :email AND o.isUsed = false")
    List<Otp> findUnusedOtpsByEmail(@Param("email") String email);
    
    @Query("DELETE FROM Otp o WHERE o.email = :email AND o.isUsed = true")
    void deleteUsedOtpsByEmail(@Param("email") String email);
} 