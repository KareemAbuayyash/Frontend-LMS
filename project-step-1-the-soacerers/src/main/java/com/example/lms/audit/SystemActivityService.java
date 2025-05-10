package com.example.lms.audit;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class SystemActivityService {

    private final SystemActivityRepository repo;

    public SystemActivityService(SystemActivityRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public void logEvent(String type, String message) {
        SystemActivityEntity e = new SystemActivityEntity();
        e.setTimestamp(Instant.now());
        e.setType(type);
        e.setMessage(message);
        repo.save(e);
    }
}
