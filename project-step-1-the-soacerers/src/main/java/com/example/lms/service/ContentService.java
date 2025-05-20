package com.example.lms.service;

import com.example.lms.dto.ContentUploadDTO;
import com.example.lms.entity.Content;
import com.example.lms.entity.Course;
import com.example.lms.entity.Instructor;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.mapper.ContentMapper;
import com.example.lms.repository.ContentRepository;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContentService {
    private final ContentRepository contentRepo;
    private final CourseRepository courseRepo;
    private final InstructorRepository instructorRepo;
    private final Path uploadDir = Paths.get("C:/my-uploads");

    /** Create new content from DTO **/
    @Transactional
    public Content createContent(ContentUploadDTO dto) throws IOException {
        Course course = courseRepo.findById(dto.getCourseId())
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        Instructor instr = instructorRepo.findById(dto.getUploadedBy())
            .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));

        // ensure dir
        Files.createDirectories(uploadDir);

        MultipartFile file = dto.getFiles() != null && !dto.getFiles().isEmpty()
            ? dto.getFiles().get(0)
            : null;

        String storedPath = null, contentType = null;
        if (file != null && !file.isEmpty()) {
            String fn = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path dest = uploadDir.resolve(fn);
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
            }
            storedPath = dest.toString();
            contentType = file.getContentType();
        }

        Content c = new Content();
        c.setTitle(dto.getTitle());
        c.setDescription(dto.getDescription());
        c.setFilePath(storedPath);
        c.setFileType(contentType);
        c.setCourse(course);
        c.setUploadedBy(instr);
        return contentRepo.save(c);
    }

    /** List **/
    public List<Content> getContentByCourse(Long courseId) {
        return contentRepo.findByCourseId(courseId);
    }

    /** Read **/
    public Content getContentById(Long id) {
        return contentRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Content not found"));
    }

    /** Update metadata and optionally replace file **/
    @Transactional
    public Content updateContent(Long id,
                                 String title,
                                 String description,
                                 MultipartFile file) {
        Content c = getContentById(id);
        c.setTitle(title);
        c.setDescription(description);

        if (file != null && !file.isEmpty()) {
            // delete old
            try {
                Files.deleteIfExists(Paths.get(c.getFilePath()));
            } catch (Exception ignored) {}
            // save new
            try {
                Files.createDirectories(uploadDir);
                String fn = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path dest = uploadDir.resolve(fn);
                try (InputStream in = file.getInputStream()) {
                    Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
                }
                c.setFilePath(dest.toString());
                c.setFileType(file.getContentType());
            } catch (IOException e) {
                throw new UncheckedIOException(e);
            }
        }

        return contentRepo.save(c);
    }

    /** Delete both DB & disk **/
    @Transactional
    public void deleteContent(Long id) {
        Content c = getContentById(id);
        try {
            Files.deleteIfExists(Paths.get(c.getFilePath()));
        } catch (Exception ignored) {}
        contentRepo.delete(c);
    }
}
