package com.example.lms.notification;

import com.example.lms.service.EmailService;
import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService implements NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailNotificationService.class);
    private final EmailService emailService;

    public EmailNotificationService(EmailService emailService) {
        this.emailService = emailService;
    }

    @Override
    public void sendNotification(Notification notification) {
        if (notification.getType() != NotificationType.EMAIL) {
            logger.warn("EmailNotificationService only handles EMAIL notifications.");
            return;
        }
        try {
            // Here we use a simple plain text email.
            // Adjust the subject or message if you need to use Thymeleaf templates.
            emailService.sendEmail(notification.getTo(), notification.getSubject(), notification.getMessage());
            logger.info("Email notification sent to {} with subject {}", notification.getTo(), notification.getSubject());
        } catch (MessagingException e) {
            logger.error("Error sending email notification", e);
        }
    }
}
