package com.example.lms.service;

import com.example.lms.dto.InstructorDTO;
import com.example.lms.dto.InstructorUpdateDTO;
import com.example.lms.entity.Instructor;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.mapper.InstructorMapper;
import com.example.lms.repository.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InstructorService {

    @Autowired
    private InstructorRepository instructorRepository;

    @Autowired
    private InstructorMapper instructorMapper;

  
    @Transactional(readOnly = true)
    public InstructorDTO getInstructorById(Long id) {
        Instructor instructor = instructorRepository.findByIdWithCourses(id)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found with ID: " + id));
        return instructorMapper.toDTO(instructor);
    }

    
    @Transactional
    public InstructorDTO updateInstructor(Long id, InstructorUpdateDTO updateDto) {
        Instructor instructor = instructorRepository.findByIdWithCourses(id)
            .orElseThrow(() -> new ResourceNotFoundException("Instructor not found with ID: " + id));
        
        instructor.setGraduateDegree(updateDto.getGraduateDegree());
        instructor.setExpertise(updateDto.getExpertise());
        
        instructorRepository.save(instructor);
        
        return instructorMapper.toDTO(instructor);
    }

}
