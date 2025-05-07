package com.example.lms.mapper;

import com.example.lms.dto.SubmissionDTO;
import com.example.lms.entity.Assignment;
import com.example.lms.entity.AssignmentSubmission;
import com.example.lms.entity.Student;

/**
 * Maps between AssignmentSubmission entity and SubmissionDTO.
 */
public class AssignmentSubmissionMapper {

    /**
     * Convert an AssignmentSubmission entity to a SubmissionDTO.
     *
     * @param entity the AssignmentSubmission entity
     * @return a SubmissionDTO with the same data
     */
    public static SubmissionDTO toDTO(AssignmentSubmission entity) {
        if (entity == null) {
            return null;
        }
        SubmissionDTO dto = new SubmissionDTO();
        dto.setId(entity.getId());
        dto.setSubmissionContent(entity.getSubmissionContent());
        dto.setScore(entity.getScore());
        dto.setGraded(entity.isGraded());
        dto.setSubmissionDate(entity.getSubmissionDate());

        if (entity.getAssignment() != null) {
            dto.setAssignmentId(entity.getAssignment().getId());
        }
        if (entity.getStudent() != null) {
            dto.setStudentId(entity.getStudent().getId());
        }

        return dto;
    }

    /**
     * Convert a SubmissionDTO to an AssignmentSubmission entity.
     *
     * @param dto the SubmissionDTO
     * @param assignment (optional) the Assignment entity if already loaded
     * @param student (optional) the Student entity if already loaded
     * @return a new AssignmentSubmission entity
     */
    public static AssignmentSubmission toEntity(SubmissionDTO dto, Assignment assignment, Student student) {
        if (dto == null) {
            return null;
        }
        AssignmentSubmission entity = new AssignmentSubmission();
        entity.setId(dto.getId());
        entity.setSubmissionContent(dto.getSubmissionContent());
        entity.setScore(dto.getScore());
        entity.setGraded(dto.isGraded());
        entity.setSubmissionDate(dto.getSubmissionDate());

        if (assignment != null) {
            entity.setAssignment(assignment);
        }
        if (student != null) {
            entity.setStudent(student);
        }

        return entity;
    }
}
