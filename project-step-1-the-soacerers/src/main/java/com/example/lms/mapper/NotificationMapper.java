package com.example.lms.mapper;

import com.example.lms.entity.Content;
import com.example.lms.entity.Course;
import com.example.lms.entity.Student;
import com.example.lms.notification.Notification;
import com.example.lms.notification.NotificationType;

import java.util.List;
import java.util.stream.Collectors;

public class NotificationMapper {

    public static List<Notification> mapContentNotification(Course course, Content content) {
        return course.getStudents().stream()
            .map(student -> {
                Notification notification = new Notification();
                notification.setTo(student.getUser().getEmail());
                notification.setSubject("New Content Uploaded in " + course.getCourseName());
                notification.setMessage(String.format("Hello,\n\nNew content titled '%s' has been uploaded to your course %s. Please log in to the LMS to view the content.\n\nBest regards,\nLMS Team",
                        content.getTitle(), course.getCourseName()));
                notification.setType(NotificationType.EMAIL);
                return notification;
            })
            .collect(Collectors.toList());
    }
}
