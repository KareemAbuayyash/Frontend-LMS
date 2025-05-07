package com.example.lms.notification;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.lms.service.ContentNotificationService;
import com.example.lms.service.ContentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final ContentService contentService;
    private final ContentNotificationService notificationService;

    @PostMapping("/content/{id}/test")
    public ResponseEntity<String> testContentNotification(@PathVariable Long id) {
        var content = contentService.getContentById(id);
        notificationService.notifyEnrolledStudents(content.getCourse(), content);
        return ResponseEntity.ok("Notifications dispatched for content " + id);
    }
}
