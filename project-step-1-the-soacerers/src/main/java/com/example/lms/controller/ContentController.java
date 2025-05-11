package com.example.lms.controller;

import com.example.lms.audit.SystemActivityService;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @Autowired
    private final ContentService contentService;
    @Autowired
    private final CourseRepository courseRepository;
    @Autowired
    private final InstructorRepository instructorRepository;
    @Autowired
    private final ContentNotificationService contentNotificationService;
    @Autowired
    private final SystemActivityService systemActivityService;

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @PostMapping("/upload")
    public ResponseEntity<?> uploadContent(@Valid @ModelAttribute ContentUploadDTO contentUploadDTO) {
        logger.info("Received upload request: Title={}, Description={}, CourseID={}, UploadedBy={}",
                contentUploadDTO.getTitle(),
                contentUploadDTO.getDescription(),
                contentUploadDTO.getCourseId(),
                contentUploadDTO.getUploadedBy());

        try {
            Content savedContent = null;
            String uploadDir = "C:/my-uploads";
            File directory = new File(uploadDir);
            if (!directory.exists() && !directory.mkdirs()) {
                throw new IOException("Failed to create upload directory at: " + directory.getAbsolutePath());
            }

            // handle file uploads
            if (contentUploadDTO.getFiles() != null && !contentUploadDTO.getFiles().isEmpty()) {
                for (MultipartFile file : contentUploadDTO.getFiles()) {
                    if (file != null && !file.isEmpty()) {
                        String filePath = uploadDir + File.separator + file.getOriginalFilename();
                        file.transferTo(new File(filePath));

                        Course course = courseRepository.findById(contentUploadDTO.getCourseId())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                "Course with ID " + contentUploadDTO.getCourseId() + " not found"));
                        Instructor instructor = instructorRepository.findById(contentUploadDTO.getUploadedBy())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                "Instructor with ID " + contentUploadDTO.getUploadedBy() + " not found"));

                        savedContent = ContentMapper.toEntityFromFile(
                            contentUploadDTO, filePath, course, instructor, file);
                        savedContent = contentService.uploadContent(savedContent);

                        logger.info("File '{}' saved as content ID {}", file.getOriginalFilename(), savedContent.getId());
                    }
                }

            // handle text‐only uploads
            } else if (contentUploadDTO.getTextContent() != null &&
                       !contentUploadDTO.getTextContent().trim().isEmpty()) {

                String filename = contentUploadDTO.getTitle().replaceAll("\\s+", "_") + ".txt";
                String filePath = uploadDir + File.separator + filename;
                java.nio.file.Files.write(
                    java.nio.file.Paths.get(filePath),
                    contentUploadDTO.getTextContent().getBytes(java.nio.charset.StandardCharsets.UTF_8)
                );

                Course course = courseRepository.findById(contentUploadDTO.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                        "Course with ID " + contentUploadDTO.getCourseId() + " not found"));
                Instructor instructor = instructorRepository.findById(contentUploadDTO.getUploadedBy())
                    .orElseThrow(() -> new ResourceNotFoundException(
                        "Instructor with ID " + contentUploadDTO.getUploadedBy() + " not found"));

                savedContent = ContentMapper.toEntityFromText(
                    contentUploadDTO, filePath, course, instructor);
                savedContent = contentService.uploadContent(savedContent);

                logger.info("Text content '{}' saved as content ID {}", filename, savedContent.getId());

            } else {
                logger.warn("No files or text content provided");
                return ResponseEntity.badRequest()
                                     .body("Either at least one file or text content is required.");
            }

            // notify & log
            if (savedContent != null) {
                contentNotificationService.notifyEnrolledStudents(
                    savedContent.getCourse(), savedContent);

                systemActivityService.logEvent(
                    "CONTENT_UPLOAD",
                    String.format(
                      "Content ID %d (%s) uploaded by instructor ID %d",
                      savedContent.getId(),
                      savedContent.getTitle(),
                      savedContent.getUploadedBy().getId()
                    )
                );

                return ResponseEntity.ok(
                  "Content uploaded successfully. Last Content ID: " + savedContent.getId()
                );
            }

            return ResponseEntity.ok("No content was processed.");

        } catch (ResourceNotFoundException rnfe) {
            logger.error("Resource not found: {}", rnfe.getMessage());
            return ResponseEntity.status(404).body(rnfe.getMessage());

        } catch (IOException ioe) {
            logger.error("Content upload failed: {}", ioe.getMessage());
            return ResponseEntity.status(500)
                                 .body("Content upload failed: " + ioe.getMessage());

        } catch (Exception ex) {
            logger.error("Unexpected error during upload", ex);
            return ResponseEntity.status(500)
                                 .body("An unexpected error occurred: " + ex.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ContentResponseDTO>> getContentByCourse(
            @PathVariable Long courseId) {

        List<ContentResponseDTO> dtos = contentService
            .getContentByCourse(courseId)
            .stream()
            .map(ContentMapper::toDTO)
            .collect(Collectors.toList());

        systemActivityService.logEvent(
            "CONTENT_LIST",
            String.format("Fetched %d content items for course ID %d", dtos.size(), courseId)
        );

        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ContentResponseDTO> getContentById(@PathVariable Long id) {
        Content content = contentService.getContentById(id);
        ContentResponseDTO dto = ContentMapper.toDTO(content);

        systemActivityService.logEvent(
            "CONTENT_VIEW",
            String.format("Content ID %d viewed", id)
        );

        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        Content content = contentService.getContentById(id);
        File file = new File(content.getFilePath());
        if (!file.exists()) {
            throw new ResourceNotFoundException("File not found on disk for content ID: " + id);
        }

        Resource resource = new org.springframework.core.io.FileSystemResource(file);
        String contentType;
        try {
            contentType = java.nio.file.Files.probeContentType(file.toPath());
        } catch (IOException e) {
            contentType = "application/octet-stream";
        }

        systemActivityService.logEvent(
            "CONTENT_DOWNLOAD",
            String.format("Content ID %d downloaded", id)
        );

        return ResponseEntity.ok()
            .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                    "inline; filename=\"" + file.getName() + "\"")
            .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
            .body(resource);
    }
}
