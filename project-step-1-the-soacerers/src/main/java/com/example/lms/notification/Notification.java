package com.example.lms.notification;

import java.time.LocalDateTime;

public class Notification {
    private String to;           // Recipient email address.
    private String subject;
    private String message;
    private NotificationType type;
    private LocalDateTime timestamp;

    public Notification() {
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters
    public String getTo() {
        return to;
    }
    public void setTo(String to) {
        this.to = to;
    }
    public String getSubject() {
        return subject;
    }
    public void setSubject(String subject) {
        this.subject = subject;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public NotificationType getType() {
        return type;
    }
    public void setType(NotificationType type) {
        this.type = type;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
