package com.epathshala.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileService {
    
    private final Path uploadsPath = Paths.get("uploads");
    private final Path assignmentsPath = uploadsPath.resolve("assignments");
    private final Path submissionsPath = uploadsPath.resolve("submissions");
    
    public FileService() {
        try {
            Files.createDirectories(assignmentsPath);
            Files.createDirectories(submissionsPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directories", e);
        }
    }
    
    public String uploadAssignmentFile(MultipartFile file) throws IOException {
        return uploadFile(file, assignmentsPath);
    }
    
    public String uploadSubmissionFile(MultipartFile file) throws IOException {
        return uploadFile(file, submissionsPath);
    }
    
    private String uploadFile(MultipartFile file, Path targetPath) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String cleanFilename = StringUtils.cleanPath(originalFilename != null ? originalFilename : "unknown");
        String fileExtension = getFileExtension(cleanFilename);
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        
        Path targetFile = targetPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);
        
        return uniqueFilename;
    }
    
    public Resource loadFileAsResource(String filename, Path targetPath) throws MalformedURLException {
        Path filePath = targetPath.resolve(filename);
        Resource resource = new UrlResource(filePath.toUri());
        
        if (resource.exists()) {
            return resource;
        } else {
            throw new RuntimeException("File not found: " + filename);
        }
    }
    
    public Resource loadAssignmentFile(String filename) throws MalformedURLException {
        return loadFileAsResource(filename, assignmentsPath);
    }
    
    public Resource loadSubmissionFile(String filename) throws MalformedURLException {
        return loadFileAsResource(filename, submissionsPath);
    }
    
    public void deleteFile(String filename, Path targetPath) throws IOException {
        Path filePath = targetPath.resolve(filename);
        Files.deleteIfExists(filePath);
    }
    
    public void deleteAssignmentFile(String filename) throws IOException {
        deleteFile(filename, assignmentsPath);
    }
    
    public void deleteSubmissionFile(String filename) throws IOException {
        deleteFile(filename, submissionsPath);
    }
    
    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
    
    public boolean isValidFileType(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && (
            contentType.equals("application/pdf") ||
            contentType.equals("application/msword") ||
            contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
            contentType.equals("image/jpeg") ||
            contentType.equals("image/png")
        );
    }
    
    public String getFileSizeInMB(long bytes) {
        return String.format("%.2f", (double) bytes / (1024 * 1024));
    }
} 