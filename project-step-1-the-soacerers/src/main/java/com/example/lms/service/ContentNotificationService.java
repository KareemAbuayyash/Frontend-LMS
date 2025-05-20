package com.example.lms.service;

import com.example.lms.entity.Content;
import com.example.lms.entity.Course;
import com.example.lms.mapper.NotificationMapper;
import com.example.lms.notification.Notification;
import com.example.lms.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContentNotificationService {
    private static final Logger logger = LoggerFactory.getLogger(ContentNotificationService.class);
    private final NotificationService notificationService;

    public void notifyEnrolledStudents(Course course, Content savedContent) {
        if (course.getStudents() != null && !course.getStudents().isEmpty()) {
            List<Notification> notifications = NotificationMapper.mapContentNotification(course, savedContent);
            notifications.forEach(notification -> {
                notificationService.sendNotification(notification);
                logger.info("Notification sent to: {}", notification.getTo());
            });
        } else {
            logger.info("No students enrolled in course ID: {}", course.getId());
        }
    }
}
