package com.example.lms.audit;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "system_activity")
public class SystemActivityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Instant timestamp;

    private String type;

    @Column(length = 2000)
    private String message;

    // ─── Getters & setters ────────────────────────────────────────────────────

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Instant getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}
