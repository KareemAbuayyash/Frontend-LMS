// src/main/java/com/example/lms/service/StorageService.java
package com.example.lms.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    /**
     * Store the given file and return its public URL (relative).
     */
    String store(MultipartFile file);
}
