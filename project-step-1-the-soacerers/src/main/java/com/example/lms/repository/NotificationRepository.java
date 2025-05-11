// src/main/java/com/example/lms/repository/NotificationRepository.java
package com.example.lms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.lms.entity.NotificationEntity;

public interface NotificationRepository
        extends JpaRepository<NotificationEntity, Long> {

    List<NotificationEntity> findByRecipientOrderByTimestampDesc(String recipient);

    /*  NEW  */
    int countByRecipientAndReadFalse(String recipient);

    @Transactional
    @Modifying
    void deleteByRecipient(String recipient);   // if you ever want to purge

    @Transactional
    @Modifying
    @Query("UPDATE NotificationEntity n SET n.read = true WHERE n.recipient = :recipient AND n.read = false")
    int markAllRead(@Param("recipient") String recipient);
}
