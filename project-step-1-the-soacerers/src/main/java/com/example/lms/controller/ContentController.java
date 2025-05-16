package com.example.lms.controller;

import com.example.lms.dto.ContentResponseDTO;
import com.example.lms.dto.ContentUploadDTO;
import com.example.lms.entity.Content;
import com.example.lms.entity.Course;
import com.example.lms.entity.Instructor;
import com.example.lms.entity.User;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.mapper.ContentMapper;
import com.example.lms.service.ContentNotificationService;
import com.example.lms.service.ContentService;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.io.File;
import java.io.IOException;
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
    private final ContentNotificationService contentNotificationService;

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @PostMapping("/upload")
    public ResponseEntity<?> uploadContent(@Valid @ModelAttribute ContentUploadDTO contentUploadDTO) {
        logger.info("Received upload request: Title={}, Description={}, CourseID={}, UploadedBy={}",
                contentUploadDTO.getTitle(), contentUploadDTO.getDescription(),
                contentUploadDTO.getCourseId(), contentUploadDTO.getUploadedBy());

        try {
            Long lastSavedContentId = null;
            Content savedContent = null;
            String uploadDir = "C:/my-uploads";
            File directory = new File(uploadDir);
            if (!directory.exists() && !directory.mkdirs()) {
                throw new IOException("Failed to create upload directory at: " + directory.getAbsolutePath());
            }
            
            if (contentUploadDTO.getFiles() != null && !contentUploadDTO.getFiles().isEmpty()) {
                for (MultipartFile file : contentUploadDTO.getFiles()) {
                    if (file != null && !file.isEmpty()) {
                        logger.info("Processing file: {}", file.getOriginalFilename());
                        String filePath = uploadDir + File.separator + file.getOriginalFilename();
                        File uploadFile = new File(filePath);
                        file.transferTo(uploadFile);
                        logger.info("File saved to: {}", filePath);

                        Course course = courseRepository.findById(contentUploadDTO.getCourseId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                        "Course with ID " + contentUploadDTO.getCourseId() + " not found"));
                        Instructor instructor = instructorRepository.findById(contentUploadDTO.getUploadedBy())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                        "Instructor with ID " + contentUploadDTO.getUploadedBy() + " not found"));

                        Content content = ContentMapper.toEntityFromFile(contentUploadDTO, filePath, course, instructor, file);
                        savedContent = contentService.uploadContent(content);
                        lastSavedContentId = savedContent.getId();
                        logger.info("Content saved with ID: {}", savedContent.getId());
                    }
                }
            } else if (contentUploadDTO.getTextContent() != null && !contentUploadDTO.getTextContent().trim().isEmpty()) {
                logger.info("Processing text content for title: {}", contentUploadDTO.getTitle());
                String filename = contentUploadDTO.getTitle().replaceAll("\\s+", "_") + ".txt";
                String filePath = uploadDir + File.separator + filename;
                java.nio.file.Files.write(java.nio.file.Paths.get(filePath),
                        contentUploadDTO.getTextContent().getBytes(java.nio.charset.StandardCharsets.UTF_8));
                logger.info("Text content saved to: {}", filePath);

                Course course = courseRepository.findById(contentUploadDTO.getCourseId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Course with ID " + contentUploadDTO.getCourseId() + " not found"));
                Instructor instructor = instructorRepository.findById(contentUploadDTO.getUploadedBy())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Instructor with ID " + contentUploadDTO.getUploadedBy() + " not found"));

                Content content = ContentMapper.toEntityFromText(contentUploadDTO, filePath, course, instructor);
                savedContent = contentService.uploadContent(content);
                lastSavedContentId = savedContent.getId();
                logger.info("Content saved with ID: {}", savedContent.getId());
            } else {
                logger.warn("No files or text content provided in the upload request");
                return ResponseEntity.badRequest().body("Either at least one file or text content is required.");
            }

            if (lastSavedContentId != null && savedContent != null) {
                logger.info("Content uploaded successfully. Last Content ID: {}", lastSavedContentId);
                contentNotificationService.notifyEnrolledStudents(savedContent.getCourse(), savedContent);
                return ResponseEntity.ok("Content uploaded successfully. Last Content ID: " + lastSavedContentId);
            } else {
                logger.info("No files or text were processed in the upload request");
                return ResponseEntity.ok("No files or text were processed.");
            }
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found: {}", e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IOException e) {
            logger.error("Content upload failed: {}", e.getMessage());
            return ResponseEntity.status(500).body("Content upload failed: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error occurred during content upload: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ContentResponseDTO>> getContentByCourse(@PathVariable Long courseId) {
        logger.info("Fetching content for course ID: {}", courseId);
        List<Content> contentList = contentService.getContentByCourse(courseId);
        List<ContentResponseDTO> dtos = contentList.stream()
                .map(ContentMapper::toDTO)
                .collect(Collectors.toList());
        logger.info("Fetched {} content items for course ID: {}", dtos.size(), courseId);
        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ContentResponseDTO> getContentById(@PathVariable Long id) {
        logger.info("Fetching content with ID: {}", id);
        Content content = contentService.getContentById(id);
        ContentResponseDTO dto = ContentMapper.toDTO(content);
        logger.info("Content with ID: {} fetched successfully", id);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadFile(@PathVariable Long id) {
        logger.info("Downloading file for content ID: {}", id);
        Content content = contentService.getContentById(id);
        File file = new File(content.getFilePath());
        if (!file.exists()) {
            logger.error("File not found on disk for content ID: {}", id);
            throw new ResourceNotFoundException("File not found on disk");
        }
        org.springframework.core.io.Resource resource = new org.springframework.core.io.FileSystemResource(file);
        String contentType;
        try {
            contentType = java.nio.file.Files.probeContentType(file.toPath());
        } catch (IOException e) {
            contentType = "application/octet-stream";
        }
        logger.info("File for content ID: {} downloaded successfully", id);
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + file.getName() + "\"")
                .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                .body(resource);
    }
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteContent(@PathVariable Long id, Authentication auth) {
    logger.info("Request to delete content ID: {}", id);

    Content content = contentService.getContentById(id);

    // Optional: ensure that a non-admin instructor can only delete their own uploads
    var user = (User) auth.getPrincipal();
    boolean isAdmin = user.getRole().equals("ROLE_ADMIN");
    boolean isUploader = content.getUploadedBy().getUser().getUsername()
                         .equals(user.getUsername());
    if (!isAdmin && !isUploader) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // Remove physical file
    File file = new File(content.getFilePath());
    if (file.exists()) {
        if (!file.delete()) {
            logger.warn("Failed to delete file on disk: {}", file.getAbsolutePath());
        }
    }

    // Remove DB record
    contentService.deleteContent(id);
    logger.info("Content ID {} deleted", id);
    return ResponseEntity.noContent().build();
}
}
