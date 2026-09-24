package com.directnest.report.service;

import com.directnest.auth.service.AuthService;
import com.directnest.common.dto.PagedResponse;
import com.directnest.exception.ResourceNotFoundException;
import com.directnest.notification.entity.NotificationType;
import com.directnest.notification.service.NotificationService;
import com.directnest.property.dto.PropertyListResponse;
import com.directnest.property.entity.Property;
import com.directnest.property.entity.PropertyImage;
import com.directnest.property.repository.PropertyImageRepository;
import com.directnest.property.repository.PropertyRepository;
import com.directnest.report.dto.CreateReportRequest;
import com.directnest.report.dto.PropertyReportResponse;
import com.directnest.report.dto.UpdateReportStatusRequest;
import com.directnest.report.entity.PropertyReport;
import com.directnest.report.entity.ReportStatus;
import com.directnest.report.repository.PropertyReportRepository;
import com.directnest.user.dto.UserResponse;
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
public class PropertyReportService {

    private static final Logger log = LoggerFactory.getLogger(PropertyReportService.class);

    private final PropertyReportRepository propertyReportRepository;
    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final AuthService authService;
    private final NotificationService notificationService;

    public PropertyReportService(PropertyReportRepository propertyReportRepository,
                                 PropertyRepository propertyRepository,
                                 PropertyImageRepository propertyImageRepository,
                                 AuthService authService,
                                 NotificationService notificationService) {
        this.propertyReportRepository = propertyReportRepository;
        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.authService = authService;
        this.notificationService = notificationService;
    }

    @Transactional
    public PropertyReportResponse reportProperty(CreateReportRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", request.getPropertyId()));

        PropertyReport report = new PropertyReport();
        report.setUser(user);
        report.setProperty(property);
        report.setReason(request.getReason());
        report.setDescription(request.getDescription());
        report.setStatus(ReportStatus.OPEN);

        report = propertyReportRepository.save(report);
        log.info("Property report {} created by user {} for property {}", report.getId(), user.getId(), property.getId());

        return mapToResponse(report);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PropertyReportResponse> getMyReports(int page, int size) {
        User user = authService.getCurrentAuthenticatedUser();
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<PropertyReport> reportPage = propertyReportRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageRequest);

        List<PropertyReportResponse> content = reportPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<PropertyReportResponse>builder()
                .content(content)
                .page(reportPage.getNumber())
                .size(reportPage.getSize())
                .totalElements(reportPage.getTotalElements())
                .totalPages(reportPage.getTotalPages())
                .last(reportPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public PagedResponse<PropertyReportResponse> getAllReports(ReportStatus status, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);

        Page<PropertyReport> reportPage;
        if (status != null) {
            reportPage = propertyReportRepository.findByStatusOrderByCreatedAtDesc(status, pageRequest);
        } else {
            reportPage = propertyReportRepository.findAllByOrderByCreatedAtDesc(pageRequest);
        }

        List<PropertyReportResponse> content = reportPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<PropertyReportResponse>builder()
                .content(content)
                .page(reportPage.getNumber())
                .size(reportPage.getSize())
                .totalElements(reportPage.getTotalElements())
                .totalPages(reportPage.getTotalPages())
                .last(reportPage.isLast())
                .build();
    }

    @Transactional
    public PropertyReportResponse updateReportStatus(Long reportId, UpdateReportStatusRequest request) {
        PropertyReport report = propertyReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("PropertyReport", "id", reportId));

        report.setStatus(request.getStatus());
        if (request.getAdminNotes() != null) {
            report.setAdminNotes(request.getAdminNotes());
        }

        report = propertyReportRepository.save(report);
        log.info("Report {} status updated to {}", reportId, request.getStatus());

        if (report.getUser() != null) {
            notificationService.createNotification(
                    report.getUser(),
                    "Report Update",
                    "Your report on property #" + report.getProperty().getId() + " is now " + request.getStatus(),
                    NotificationType.SYSTEM,
                    report.getId()
            );
        }

        return mapToResponse(report);
    }

    private PropertyReportResponse mapToResponse(PropertyReport report) {
        PropertyReportResponse response = new PropertyReportResponse();
        response.setId(report.getId());
        response.setReason(report.getReason());
        response.setDescription(report.getDescription());
        response.setStatus(report.getStatus());
        response.setAdminNotes(report.getAdminNotes());
        response.setCreatedAt(report.getCreatedAt());

        if (report.getUser() != null) {
            UserResponse userResp = new UserResponse();
            userResp.setId(report.getUser().getId());
            userResp.setFullName(report.getUser().getFullName());
            userResp.setEmail(report.getUser().getEmail());
            response.setUser(userResp);
        }

        if (report.getProperty() != null) {
            Property p = report.getProperty();
            PropertyListResponse propResp = new PropertyListResponse();
            propResp.setId(p.getId());
            propResp.setTitle(p.getTitle());
            propResp.setPropertyType(p.getPropertyType());
            propResp.setListingType(p.getListingType());
            propResp.setPrice(p.getPrice());
            propResp.setCity(p.getCity());
            propResp.setLocality(p.getLocality());
            propResp.setStatus(p.getStatus());
            propResp.setCreatedAt(p.getCreatedAt());

            List<PropertyImage> images = propertyImageRepository.findByPropertyIdOrderByDisplayOrderAsc(p.getId());
            if (!images.isEmpty()) {
                PropertyImage primary = images.stream().filter(PropertyImage::isPrimary).findFirst().orElse(images.get(0));
                propResp.setPrimaryImageUrl(primary.getImageUrl());
            }
            response.setProperty(propResp);
        }

        return response;
    }
}
