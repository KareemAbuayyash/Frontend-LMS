package com.example.lms.mapper;

import com.example.lms.dto.AssignmentDTO;
import com.example.lms.entity.Assignment;
import com.example.lms.entity.Course;

/**
 * Maps between Assignment entity and AssignmentDTO.
 */
public class AssignmentMapper {

    /**
     * Convert an Assignment entity to an AssignmentDTO.
     *
     * @param entity the Assignment entity
     * @return an AssignmentDTO with the same data
     */
    public static AssignmentDTO toDTO(Assignment entity) {
        if (entity == null) {
            return null;
        }
        AssignmentDTO dto = new AssignmentDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setScore(entity.getScore());
        dto.setGraded(entity.isGraded());
        dto.setTotalPoints(entity.getTotalPoints());
        dto.setDueDate(entity.getDueDate());
        if (entity.getCourse() != null) {
            dto.setCourseId(entity.getCourse().getId());
        }
        return dto;
    }

    /**
     * Convert an AssignmentDTO to an Assignment entity.
     *
     * @param dto the AssignmentDTO
     * @param course (optional) a Course entity if you already have it loaded
     * @return a new Assignment entity
     */
    public static Assignment toEntity(AssignmentDTO dto, Course course) {
        if (dto == null) {
            return null;
        }
        Assignment entity = new Assignment();
        entity.setId(dto.getId());
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setScore(dto.getScore());
        entity.setGraded(dto.isGraded());
        entity.setTotalPoints(dto.getTotalPoints());
        entity.setDueDate(dto.getDueDate());
        if (course != null) {
            entity.setCourse(course);
        }
        return entity;
    }
}
