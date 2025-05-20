package com.example.lms.controller;

import com.example.lms.dto.ContentResponseDTO;
import com.example.lms.dto.ContentUploadDTO;
import com.example.lms.entity.Content;
import com.example.lms.entity.Course;
import com.example.lms.entity.Instructor;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.mapper.ContentMapper;
import com.example.lms.service.ContentNotificationService;
import com.example.lms.service.ContentService;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {
    private static final Logger logger = LoggerFactory.getLogger(ContentController.class);

    private final ContentService contentService;
    private final CourseRepository courseRepository;
    private final InstructorRepository instructorRepository;
    private final ContentNotificationService notificationService;

    // ——————————————————————————
    // CREATE (upload)
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadContent(@Valid @ModelAttribute ContentUploadDTO dto) {
        logger.info("Upload request: {}", dto);
        try {
            Content saved = contentService.createContent(dto);
            notificationService.notifyEnrolledStudents(saved.getCourse(), saved);
            return ResponseEntity.ok(ContentMapper.toDTO(saved));
        } catch (Exception ex) {
            logger.error("Upload failed", ex);
            return ResponseEntity.status(500).body(ex.getMessage());
        }
    }

    // ——————————————————————————
    // READ all for a course
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR','STUDENT')")
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ContentResponseDTO>> listByCourse(@PathVariable Long courseId) {
        List<ContentResponseDTO> list = contentService.getContentByCourse(courseId)
            .stream()
            .map(ContentMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    // ——————————————————————————
    // READ single
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR','STUDENT')")
    @GetMapping("/{id}")
    public ResponseEntity<ContentResponseDTO> getOne(@PathVariable Long id) {
        Content c = contentService.getContentById(id);
        return ResponseEntity.ok(ContentMapper.toDTO(c));
    }

    // ——————————————————————————
    // DOWNLOAD
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR','STUDENT')")
    @GetMapping("/{id}/download")
    public ResponseEntity<org.springframework.core.io.Resource> download(@PathVariable Long id) throws IOException {
        Content c = contentService.getContentById(id);
        File file = new File(c.getFilePath());
        if (!file.exists()) throw new ResourceNotFoundException("File not found");
        String ct = Files.probeContentType(file.toPath());
        org.springframework.core.io.Resource res = new org.springframework.core.io.FileSystemResource(file);
        return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=\"" + file.getName() + "\"")
            .contentType(MediaType.parseMediaType(ct == null ? "application/octet-stream" : ct))
            .body(res);
    }

    // ——————————————————————————
    // UPDATE
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ContentResponseDTO> updateContent(
        @PathVariable Long id,
        @RequestPart("title") String title,
        @RequestPart(value="description", required=false) String desc,
        @RequestPart(value="files", required=false) MultipartFile file
    ) {
        Content updated = contentService.updateContent(id, title, desc, file);
        notificationService.notifyEnrolledStudents(updated.getCourse(), updated);
        return ResponseEntity.ok(ContentMapper.toDTO(updated));
    }

    // ——————————————————————————
    // DELETE
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
        contentService.deleteContent(id);
        return ResponseEntity.noContent().build();
    }
}
