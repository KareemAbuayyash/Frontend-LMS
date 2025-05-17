package com.example.lms.mapper;

import com.example.lms.dto.AssignmentDTO;
import com.example.lms.entity.Assignment;
import com.example.lms.entity.Course;

public class AssignmentMapper {
  public static AssignmentDTO toDTO(Assignment e) {
    if (e == null) return null;
    AssignmentDTO d = new AssignmentDTO();
    d.setId(e.getId());
    d.setTitle(e.getTitle());
    d.setDescription(e.getDescription());
    d.setDueDate(e.getDueDate());
    d.setTotalPoints(e.getTotalPoints());
    d.setScore(e.getScore());
    d.setGraded(e.isGraded());
    d.setCourseId(e.getCourse().getId());
    d.setAttachmentUrl(e.getAttachmentUrl());
    return d;
  }

  public static Assignment toEntity(AssignmentDTO d, Course c) {
    if (d == null) return null;
    Assignment e = new Assignment();
    e.setTitle(d.getTitle());
    e.setDescription(d.getDescription());
    e.setDueDate(d.getDueDate());
    e.setTotalPoints(d.getTotalPoints());
    e.setCourse(c);
    return e;
  }
}
