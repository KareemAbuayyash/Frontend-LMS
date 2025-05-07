package com.example.lms.assembler;

import com.example.lms.dto.EnrollmentDTO;
import com.example.lms.controller.EnrollmentController;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class EnrollmentModelAssembler implements RepresentationModelAssembler<EnrollmentDTO, EntityModel<EnrollmentDTO>> {

    @Override
    public EntityModel<EnrollmentDTO> toModel(EnrollmentDTO enrollment) {
        return EntityModel.of(enrollment,
            linkTo(methodOn(EnrollmentController.class).one(enrollment.getEnrollmentId())).withSelfRel(),
            linkTo(methodOn(EnrollmentController.class).all()).withRel("enrollments"));
    }
}
