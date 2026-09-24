package com.directnest.config;

import com.directnest.exception.FileStorageException;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.upload.allowed-image-types}")
    private Set<String> allowedImageTypes;

    @Value("${app.upload.allowed-document-types}")
    private Set<String> allowedDocumentTypes;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadPath);
            Files.createDirectories(this.uploadPath.resolve("images"));
            Files.createDirectories(this.uploadPath.resolve("documents"));
            Files.createDirectories(this.uploadPath.resolve("profiles"));
        } catch (IOException e) {
            throw new FileStorageException("Could not create upload directories", e);
        }
    }

    public String storeImage(MultipartFile file) {
        validateFile(file, allowedImageTypes, 5 * 1024 * 1024);
        return storeFile(file, "images");
    }

    public String storeDocument(MultipartFile file) {
        validateFile(file, allowedDocumentTypes, 10 * 1024 * 1024);
        return storeFile(file, "documents");
    }

    public String storeProfileImage(MultipartFile file) {
        validateFile(file, allowedImageTypes, 2 * 1024 * 1024);
        return storeFile(file, "profiles");
    }

    private String storeFile(MultipartFile file, String subdirectory) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");

        if (originalFilename.contains("..")) {
            throw new FileStorageException("Filename contains invalid path sequence: " + originalFilename);
        }

        String extension = getFileExtension(originalFilename);
        String storedFilename = UUID.randomUUID().toString() + extension;

        try {
            Path targetDir = this.uploadPath.resolve(subdirectory);
            Files.createDirectories(targetDir);
            Path targetLocation = targetDir.resolve(storedFilename);

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            return subdirectory + "/" + storedFilename;
        } catch (IOException e) {
            throw new FileStorageException("Could not store file " + originalFilename, e);
        }
    }

    public void deleteFile(String filePath) {
        try {
            Path file = this.uploadPath.resolve(filePath).normalize();
            if (!file.startsWith(this.uploadPath)) {
                throw new FileStorageException("Cannot delete file outside upload directory");
            }
            Files.deleteIfExists(file);
        } catch (IOException e) {
            log.warn("Could not delete file: {}", filePath, e);
        }
    }

    public Path getFilePath(String filePath) {
        Path file = this.uploadPath.resolve(filePath).normalize();
        if (!file.startsWith(this.uploadPath)) {
            throw new FileStorageException("File path is outside upload directory");
        }
        return file;
    }

    private void validateFile(MultipartFile file, Set<String> allowedTypes, long maxSize) {
        if (file.isEmpty()) {
            throw new FileStorageException("Cannot store empty file");
        }
        if (file.getSize() > maxSize) {
            throw new FileStorageException("File size exceeds maximum allowed size of " + (maxSize / (1024 * 1024)) + "MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new FileStorageException("File type not allowed. Allowed types: " + allowedTypes);
        }
    }

    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        if (lastDot > 0) {
            return filename.substring(lastDot);
        }
        return "";
    }
}
