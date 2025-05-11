// src/main/java/com/example/lms/notification/EmailNotificationService.java
package com.example.lms.notification;

import com.example.lms.entity.NotificationEntity;
import com.example.lms.repository.NotificationRepository;
import com.example.lms.service.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailNotificationService implements NotificationService {
    private static final Logger logger = LoggerFactory.getLogger(EmailNotificationService.class);

    private final EmailService emailService;
    private final NotificationRepository notificationRepository;

    @Override
    public void sendNotification(Notification notification) {
        if (notification.getType() != NotificationType.EMAIL) {
            logger.warn("EmailNotificationService only handles EMAIL notifications.");
            return;
        }
        try {
            emailService.sendEmail(
                notification.getTo(), 
                notification.getSubject(), 
                notification.getMessage()
            );

            NotificationEntity entity = new NotificationEntity();
            entity.setRecipient(notification.getTo());    // ← now a username
            entity.setSubject(notification.getSubject());
            entity.setMessage(notification.getMessage());
            entity.setType(notification.getType());
            entity.setTimestamp(LocalDateTime.now());
            notificationRepository.save(entity);

            logger.info("Notification saved for user {}", notification.getTo());
        } catch (MessagingException e) {
            logger.error("Error sending email notification", e);
        }
    }
}
