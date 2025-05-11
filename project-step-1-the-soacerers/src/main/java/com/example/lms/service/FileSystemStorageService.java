// src/main/java/com/example/lms/service/FileSystemStorageService.java
package com.example.lms.service;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileSystemStorageService implements StorageService {
  private final Path uploadDir = Paths.get("uploads");

  @PostConstruct
  public void init() throws IOException {
    if (!Files.exists(uploadDir)) {
      Files.createDirectories(uploadDir);
    }
  }

  @Override
  public String store(MultipartFile file) {
    try {
      String original = file.getOriginalFilename();
      String ext = (original != null && original.contains("."))
                   ? original.substring(original.lastIndexOf('.'))
                   : "";
      String filename = UUID.randomUUID() + ext;
      Path dest = uploadDir.resolve(filename);
      Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
      return "/uploads/" + filename;
    } catch (IOException e) {
      throw new RuntimeException("Failed to store file", e);
    }
  }
}
