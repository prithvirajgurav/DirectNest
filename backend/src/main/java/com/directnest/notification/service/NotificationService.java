package com.directnest.notification.service;

import com.directnest.auth.service.AuthService;
import com.directnest.common.dto.PagedResponse;
import com.directnest.exception.ForbiddenException;
import com.directnest.exception.ResourceNotFoundException;
import com.directnest.notification.dto.NotificationResponse;
import com.directnest.notification.entity.Notification;
import com.directnest.notification.entity.NotificationType;
import com.directnest.notification.repository.NotificationRepository;
import com.directnest.user.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final AuthService authService;

    public NotificationService(NotificationRepository notificationRepository, AuthService authService) {
        this.notificationRepository = notificationRepository;
        this.authService = authService;
    }

    @Transactional
    public void createNotification(User user, String title, String message, NotificationType type, Long referenceId) {
        Notification notification = new Notification(user, title, message, type, referenceId);
        notificationRepository.save(notification);
        log.info("Created notification '{}' for user {}", title, user.getId());
    }

    @Transactional(readOnly = true)
    public PagedResponse<NotificationResponse> getMyNotifications(int page, int size) {
        User user = authService.getCurrentAuthenticatedUser();
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Notification> notificationPage = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageRequest);

        List<NotificationResponse> content = notificationPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<NotificationResponse>builder()
                .content(content)
                .page(notificationPage.getNumber())
                .size(notificationPage.getSize())
                .totalElements(notificationPage.getTotalElements())
                .totalPages(notificationPage.getTotalPages())
                .last(notificationPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        User user = authService.getCurrentAuthenticatedUser();
        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        User user = authService.getCurrentAuthenticatedUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You can only update your own notifications");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead() {
        User user = authService.getCurrentAuthenticatedUser();
        notificationRepository.markAllAsReadForUser(user.getId());
    }

    private NotificationResponse mapToResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setUserId(notification.getUser().getId());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setType(notification.getType());
        response.setReferenceId(notification.getReferenceId());
        response.setRead(notification.isRead());
        response.setCreatedAt(notification.getCreatedAt());
        return response;
    }
}
