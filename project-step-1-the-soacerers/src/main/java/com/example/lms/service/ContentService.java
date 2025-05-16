package com.example.lms.service;

import com.example.lms.entity.Content;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.ContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final ContentRepository contentRepository;

    public Content uploadContent(Content content) {
        return contentRepository.save(content);
    }

    public List<Content> getContentByCourse(Long courseId) {
        return contentRepository.findByCourseId(courseId);
    }

    public Content getContentById(Long id) {
        return contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content with ID " + id + " not found"));
    }

    public void deleteContent(Long id) {
        if (!contentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Content with ID " + id + " not found");
        }
        contentRepository.deleteById(id);
    }
}
