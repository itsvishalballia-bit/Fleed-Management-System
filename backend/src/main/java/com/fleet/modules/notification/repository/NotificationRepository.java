package com.fleet.modules.notification.repository;

import com.fleet.modules.notification.entity.Notification;
import com.fleet.modules.notification.entity.NotificationCategory;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, String> {

    List<Notification> findAllByOrderByCreatedAtDesc();

    Optional<Notification> findTopByCategoryAndEntityTypeAndEntityIdAndTitleOrderByCreatedAtDesc(
        NotificationCategory category,
        String entityType,
        String entityId,
        String title
    );
}
