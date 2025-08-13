package com.epathshala.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Password Utility for ePathshala System
 * 
 * Note: BCrypt passwords cannot be "decrypted" as they are one-way hashes.
 * This utility provides methods to verify passwords and generate new ones.
 */
@Component
public class PasswordUtility {
    
    private final BCryptPasswordEncoder passwordEncoder;
    
    public PasswordUtility() {
        this.passwordEncoder = new BCryptPasswordEncoder();
    }
    
    /**
     * Verify if a plain text password matches a BCrypt hash
     * @param plainPassword The plain text password to verify
     * @param hashedPassword The BCrypt hash from database
     * @return true if password matches, false otherwise
     */
    public boolean verifyPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }
    
    /**
     * Generate a BCrypt hash for a plain text password
     * @param plainPassword The plain text password to hash
     * @return BCrypt hash
     */
    public String encodePassword(String plainPassword) {
        return passwordEncoder.encode(plainPassword);
    }
    
    /**
     * Get known sample passwords for testing
     * @return Map of email to plain text password
     */
    public Map<String, String> getSamplePasswords() {
        Map<String, String> passwords = new HashMap<>();
        passwords.put("admin@epathshala.com", "admin123");
        passwords.put("teacher@epathshala.com", "teacher123");
        passwords.put("student@epathshala.com", "student123");
        passwords.put("parent@epathshala.com", "parent123");
        return passwords;
    }
    
    /**
     * Verify all sample passwords against their hashes
     * @param userPasswords Map of email to hashed password from database
     * @return Map of email to verification result
     */
    public Map<String, Boolean> verifyAllSamplePasswords(Map<String, String> userPasswords) {
        Map<String, Boolean> results = new HashMap<>();
        Map<String, String> samplePasswords = getSamplePasswords();
        
        for (Map.Entry<String, String> entry : userPasswords.entrySet()) {
            String email = entry.getKey();
            String hashedPassword = entry.getValue();
            String plainPassword = samplePasswords.get(email);
            
            if (plainPassword != null) {
                boolean matches = verifyPassword(plainPassword, hashedPassword);
                results.put(email, matches);
            }
        }
        
        return results;
    }
    
    /**
     * Generate a new random password
     * @return A new random password
     */
    public String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            password.append(chars.charAt((int) (Math.random() * chars.length())));
        }
        return password.toString();
    }
    
    /**
     * Print password verification results
     * @param userPasswords Map of email to hashed password
     */
    public void printPasswordVerificationResults(Map<String, String> userPasswords) {
        System.out.println("🔐 Password Verification Results:");
        System.out.println("=================================");
        
        Map<String, Boolean> results = verifyAllSamplePasswords(userPasswords);
        Map<String, String> samplePasswords = getSamplePasswords();
        
        for (Map.Entry<String, Boolean> entry : results.entrySet()) {
            String email = entry.getKey();
            boolean matches = entry.getValue();
            String status = matches ? "✅ MATCHES" : "❌ NO MATCH";
            String plainPassword = samplePasswords.get(email);
            
            System.out.printf("📧 %s\n", email);
            System.out.printf("   Plain Password: %s\n", plainPassword);
            System.out.printf("   Status: %s\n", status);
            System.out.println();
        }
    }
} 