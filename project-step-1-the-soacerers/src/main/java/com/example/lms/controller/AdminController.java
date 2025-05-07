package com.example.lms.controller;

import com.example.lms.entity.Admin;
import com.example.lms.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final AdminRepository adminRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Admin> getAllAdmins() {
        logger.info("Fetching all admins");
        List<Admin> admins = adminRepository.findAll();
        logger.info("Found {} admins", admins.size());
        return admins;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable Long id) {
        logger.info("Fetching admin with ID: {}", id);
        return adminRepository.findById(id)
                .map(admin -> {
                    logger.info("Admin found with ID: {}", id);
                    return ResponseEntity.ok(admin);
                })
                .orElseGet(() -> {
                    logger.warn("Admin not found with ID: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable Long id, @RequestBody Admin updated) {
        logger.info("Updating admin with ID: {}", id);
        return adminRepository.findById(id)
                .map(admin -> {
                    logger.info("Admin found with ID: {}, updating department to: {}", id, updated.getDepartment());
                    admin.setDepartment(updated.getDepartment());
                    Admin savedAdmin = adminRepository.save(admin);
                    logger.info("Admin updated successfully with ID: {}", id);
                    return ResponseEntity.ok(savedAdmin);
                })
                .orElseGet(() -> {
                    logger.warn("Admin not found with ID: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }
}

