package com.example.lms.mapper;

import com.example.lms.dto.ContentResponseDTO;
import com.example.lms.dto.ContentUploadDTO;
import com.example.lms.entity.Content;
import com.example.lms.entity.Course;
import com.example.lms.entity.Instructor;
import org.springframework.web.multipart.MultipartFile;

public class ContentMapper {


    public static Content toEntity(
            ContentUploadDTO dto,
            String filePath,
            Course course,
            Instructor instructor,
            MultipartFile file
    ) {
        Content content = new Content();
        content.setTitle(dto.getTitle());
        content.setDescription(dto.getDescription());
        content.setFileType(file != null ? file.getContentType() : null);
        content.setFilePath(filePath);
        content.setCourse(course);
        content.setUploadedBy(instructor);
        return content;
    }
    

    public static ContentResponseDTO toDTO(Content content) {
        ContentResponseDTO dto = new ContentResponseDTO();
        dto.setId(content.getId());
        dto.setTitle(content.getTitle());
        dto.setDescription(content.getDescription());
        dto.setFilePath(content.getFilePath());
        dto.setFileType(content.getFileType());
        if (content.getCourse() != null) {
            dto.setCourseId(content.getCourse().getId());
        }
        if (content.getUploadedBy() != null) {
            dto.setInstructorId(content.getUploadedBy().getId());
        }
        return dto;
    }
    public static Content toEntityFromFile(ContentUploadDTO dto, String filePath, Course course, Instructor instructor, MultipartFile file) {
        Content content = new Content();
        content.setTitle(dto.getTitle());
        content.setDescription(dto.getDescription());
        content.setFilePath(filePath);
        content.setFileType(file != null ? file.getContentType() : null);
        content.setCourse(course);
        content.setUploadedBy(instructor);
        return content;
    }
    
    public static Content toEntityFromText(ContentUploadDTO dto, String filePath, Course course, Instructor instructor) {
        Content content = new Content();
        content.setTitle(dto.getTitle());
        content.setDescription(dto.getDescription());
        content.setFilePath(filePath);
        content.setFileType("text/plain");
        content.setCourse(course);
        content.setUploadedBy(instructor);
        return content;
    }
    
    
}
