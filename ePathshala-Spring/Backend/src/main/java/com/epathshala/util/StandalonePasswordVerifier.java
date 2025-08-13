package com.epathshala.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashMap;
import java.util.Map;

/**
 * Standalone Password Verifier
 * 
 * This utility can be run independently to verify passwords.
 * It doesn't require the full Spring Boot application to be running.
 */
public class StandalonePasswordVerifier {
    
    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    // Sample passwords from DataInitializer
    private static final Map<String, String> SAMPLE_PASSWORDS = new HashMap<>();
    static {
        SAMPLE_PASSWORDS.put("admin@epathshala.com", "admin123");
        SAMPLE_PASSWORDS.put("teacher@epathshala.com", "teacher123");
        SAMPLE_PASSWORDS.put("student@epathshala.com", "student123");
        SAMPLE_PASSWORDS.put("parent@epathshala.com", "parent123");
    }
    
    /**
     * Verify if a plain text password matches a BCrypt hash
     */
    public static boolean verifyPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }
    
    /**
     * Generate a BCrypt hash for a plain text password
     */
    public static String encodePassword(String plainPassword) {
        return passwordEncoder.encode(plainPassword);
    }
    
    /**
     * Verify all sample passwords against provided hashes
     */
    public static void verifySamplePasswords(Map<String, String> userPasswords) {
        System.out.println("🔐 Standalone Password Verification Results:");
        System.out.println("=============================================");
        
        for (Map.Entry<String, String> entry : userPasswords.entrySet()) {
            String email = entry.getKey();
            String hashedPassword = entry.getValue();
            String plainPassword = SAMPLE_PASSWORDS.get(email);
            
            if (plainPassword != null) {
                boolean matches = verifyPassword(plainPassword, hashedPassword);
                String status = matches ? "✅ MATCHES" : "❌ NO MATCH";
                
                System.out.printf("📧 %s\n", email);
                System.out.printf("   Plain Password: %s\n", plainPassword);
                System.out.printf("   Hashed Password: %s\n", hashedPassword);
                System.out.printf("   Status: %s\n", status);
                System.out.println();
            }
        }
    }
    
    /**
     * Print all sample passwords
     */
    public static void printSamplePasswords() {
        System.out.println("📋 Sample Passwords:");
        System.out.println("====================");
        for (Map.Entry<String, String> entry : SAMPLE_PASSWORDS.entrySet()) {
            System.out.printf("📧 %s -> %s\n", entry.getKey(), entry.getValue());
        }
        System.out.println();
    }
    
    /**
     * Generate a new random password
     */
    public static String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            password.append(chars.charAt((int) (Math.random() * chars.length())));
        }
        return password.toString();
    }
    
    /**
     * Main method for standalone execution
     */
    public static void main(String[] args) {
        System.out.println("🔐 ePathshala Password Verifier");
        System.out.println("===============================");
        System.out.println();
        
        // Print sample passwords
        printSamplePasswords();
        
        // Example: Verify specific password
        String email = "admin@epathshala.com";
        String plainPassword = "admin123";
        String hashedPassword = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa"; // Example hash
        
        System.out.println("🔍 Testing Specific Password:");
        System.out.println("=============================");
        System.out.printf("Email: %s\n", email);
        System.out.printf("Plain Password: %s\n", plainPassword);
        System.out.printf("Hashed Password: %s\n", hashedPassword);
        System.out.printf("Matches: %s\n", verifyPassword(plainPassword, hashedPassword));
        System.out.println();
        
        // Example: Generate new password
        System.out.println("🔧 Generate New Password:");
        System.out.println("========================");
        String newPassword = generateRandomPassword();
        String newHash = encodePassword(newPassword);
        System.out.printf("New Password: %s\n", newPassword);
        System.out.printf("New Hash: %s\n", newHash);
        System.out.printf("Verification: %s\n", verifyPassword(newPassword, newHash));
        System.out.println();
        
        // Example: Test with sample hashes (you would replace these with actual hashes from your database)
        System.out.println("📊 Testing with Sample Hashes:");
        System.out.println("==============================");
        Map<String, String> sampleHashes = new HashMap<>();
        sampleHashes.put("admin@epathshala.com", "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa");
        sampleHashes.put("teacher@epathshala.com", "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa");
        sampleHashes.put("student@epathshala.com", "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa");
        sampleHashes.put("parent@epathshala.com", "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa");
        
        verifySamplePasswords(sampleHashes);
        
        System.out.println("💡 Usage Instructions:");
        System.out.println("=====================");
        System.out.println("1. Replace the sample hashes above with actual hashes from your database");
        System.out.println("2. Run this utility to verify passwords");
        System.out.println("3. Use the API endpoints for real-time verification");
        System.out.println();
        System.out.println("🔗 API Endpoints:");
        System.out.println("=================");
        System.out.println("GET  /api/password/verify-sample-passwords");
        System.out.println("POST /api/password/verify");
        System.out.println("POST /api/password/generate");
        System.out.println("GET  /api/password/sample-passwords");
        System.out.println("GET  /api/password/users");
    }
} 