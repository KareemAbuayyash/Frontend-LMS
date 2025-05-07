package com.example.lms.assembler;

import com.example.lms.dto.CourseDTO;
import com.example.lms.controller.CourseController;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class CourseModelAssembler implements RepresentationModelAssembler<CourseDTO, EntityModel<CourseDTO>> {

    @Override
    public EntityModel<CourseDTO> toModel(CourseDTO course) {
        return EntityModel.of(course,
            linkTo(methodOn(CourseController.class).one(course.getCourseId())).withSelfRel(),
            linkTo(methodOn(CourseController.class).all()).withRel("courses"));
    }
}