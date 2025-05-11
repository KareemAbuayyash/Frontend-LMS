package com.example.lms.mapper;

import com.example.lms.dto.ContentResponseDTO;
import com.example.lms.entity.Content;
import com.example.lms.entity.Course;
import com.example.lms.notification.Notification;
import com.example.lms.notification.NotificationType;

import java.util.List;
import java.util.stream.Collectors;

public class NotificationMapper {


    public static List<Notification> mapContentNotification(Course course, Content content) {
        return course.getStudents().stream()
            .map(student -> {
                Notification notification = new Notification();
                notification.setTo(student.getUser().getUsername());   // ← use username here!
                notification.setSubject("New Content Uploaded in " + course.getCourseName());
                notification.setMessage(
                    "Hello,\n\n" +
                    "New content titled '" + content.getTitle() +
                    "' has been uploaded to your course " + course.getCourseName() +
                    ". Please log in to the LMS to view it.\n\nBest regards,\nLMS Team"
                );
                notification.setType(NotificationType.EMAIL);
                return notification;
            })
            .collect(Collectors.toList());
    }
}
