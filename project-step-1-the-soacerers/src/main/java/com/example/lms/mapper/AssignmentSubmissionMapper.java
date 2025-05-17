package com.example.lms.mapper;

import com.example.lms.dto.SubmissionDTO;
import com.example.lms.entity.AssignmentSubmission;

public class AssignmentSubmissionMapper {
  public static SubmissionDTO toDTO(AssignmentSubmission e) {
    if (e == null) return null;
    SubmissionDTO d = new SubmissionDTO();
    d.setId(e.getId());
    d.setAssignmentId(e.getAssignment().getId());
    d.setStudentId(e.getStudent().getId());
    d.setSubmissionContent(e.getSubmissionContent());
    d.setSubmissionDate(e.getSubmissionDate());
    d.setScore(e.getScore());
    d.setGraded(e.isGraded());
    d.setStudentName(e.getStudent().getUser().getUsername());
    d.setFileUrl(e.getFileUrl());
    return d;
  }
}
