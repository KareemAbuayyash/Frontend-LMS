// src/main/java/com/example/lms/notification/NotificationController.java
package com.example.lms.notification;

import com.example.lms.entity.NotificationEntity;
import com.example.lms.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository repo;

    private String currentUsername() {
        return SecurityContextHolder
                 .getContext()
                 .getAuthentication()
                 .getName();
    }

    @GetMapping
    public ResponseEntity<List<NotificationEntity>> getNotifications() {
        List<NotificationEntity> list =
            repo.findByRecipientOrderByTimestampDesc(currentUsername());
        return ResponseEntity.ok(list);
    }

   @GetMapping("/unread-count")
    public ResponseEntity<Integer> unreadCount() {
        int count = repo.countByRecipientAndReadFalse(currentUsername());
        return ResponseEntity.ok(count);
    }

    @PostMapping("/mark-as-read")
    public ResponseEntity<String> markAllRead() {
        int updated = repo.markAllRead(currentUsername());
        return ResponseEntity.ok("Marked " + updated + " notification(s) as read");
    }

   @PostMapping("/content/{id}/test")
    public ResponseEntity<String> testContentNotification(@PathVariable Long id) {
        // … your existing logic (e.g. contentService.notifyEnrolledStudents(…))
        return ResponseEntity.ok("Notifications dispatched for content " + id);
    }
}
