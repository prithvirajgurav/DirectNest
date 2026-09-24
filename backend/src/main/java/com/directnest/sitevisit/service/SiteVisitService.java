package com.directnest.sitevisit.service;

import com.directnest.auth.service.AuthService;
import com.directnest.common.dto.PagedResponse;
import com.directnest.exception.BadRequestException;
import com.directnest.exception.ForbiddenException;
import com.directnest.exception.ResourceNotFoundException;
import com.directnest.notification.entity.NotificationType;
import com.directnest.notification.service.NotificationService;
import com.directnest.property.dto.PropertyListResponse;
import com.directnest.property.entity.Property;
import com.directnest.property.entity.PropertyImage;
import com.directnest.property.repository.PropertyImageRepository;
import com.directnest.property.repository.PropertyRepository;
import com.directnest.sitevisit.dto.CreateSiteVisitRequest;
import com.directnest.sitevisit.dto.SiteVisitResponse;
import com.directnest.sitevisit.dto.UpdateSiteVisitStatusRequest;
import com.directnest.sitevisit.entity.SiteVisit;
import com.directnest.sitevisit.entity.SiteVisitStatus;
import com.directnest.sitevisit.repository.SiteVisitRepository;
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
public class SiteVisitService {

    private static final Logger log = LoggerFactory.getLogger(SiteVisitService.class);

    private final SiteVisitRepository siteVisitRepository;
    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final AuthService authService;
    private final NotificationService notificationService;

    public SiteVisitService(SiteVisitRepository siteVisitRepository,
                            PropertyRepository propertyRepository,
                            PropertyImageRepository propertyImageRepository,
                            AuthService authService,
                            NotificationService notificationService) {
        this.siteVisitRepository = siteVisitRepository;
        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.authService = authService;
        this.notificationService = notificationService;
    }

    @Transactional
    public SiteVisitResponse requestSiteVisit(CreateSiteVisitRequest request) {
        User customer = authService.getCurrentAuthenticatedUser();
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", request.getPropertyId()));

        SiteVisit siteVisit = new SiteVisit();
        siteVisit.setProperty(property);
        siteVisit.setCustomer(customer);
        siteVisit.setPreferredDate(request.getPreferredDate());
        siteVisit.setPreferredTime(request.getPreferredTime());
        siteVisit.setMessage(request.getMessage());
        siteVisit.setStatus(SiteVisitStatus.REQUESTED);

        siteVisit = siteVisitRepository.save(siteVisit);
        log.info("Site visit {} requested by customer {} for property {}", siteVisit.getId(), customer.getId(), property.getId());

        if (property.getUser() != null) {
            notificationService.createNotification(
                    property.getUser(),
                    "Site Visit Requested: " + property.getTitle(),
                    customer.getFullName() + " requested a site visit on " + request.getPreferredDate() + " at " + request.getPreferredTime(),
                    NotificationType.SITE_VISIT,
                    siteVisit.getId()
            );
        }

        return mapToResponse(siteVisit);
    }

    @Transactional
    public SiteVisitResponse updateSiteVisitStatus(Long siteVisitId, UpdateSiteVisitStatusRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        SiteVisit siteVisit = siteVisitRepository.findById(siteVisitId)
                .orElseThrow(() -> new ResourceNotFoundException("SiteVisit", "id", siteVisitId));

        if (!siteVisit.getProperty().getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You can only update site visits for your own properties");
        }

        siteVisit.setStatus(request.getStatus());
        if (request.getResponseNote() != null) {
            siteVisit.setResponseNote(request.getResponseNote());
        }

        siteVisit = siteVisitRepository.save(siteVisit);
        log.info("Site visit {} status updated to {} by builder {}", siteVisitId, request.getStatus(), currentUser.getId());

        notificationService.createNotification(
                siteVisit.getCustomer(),
                "Site Visit Update: " + siteVisit.getProperty().getTitle(),
                "Your site visit status has been updated to: " + request.getStatus() + (request.getResponseNote() != null ? ". Note: " + request.getResponseNote() : ""),
                NotificationType.SITE_VISIT,
                siteVisit.getId()
        );

        return mapToResponse(siteVisit);
    }

    @Transactional
    public SiteVisitResponse cancelSiteVisit(Long siteVisitId) {
        User customer = authService.getCurrentAuthenticatedUser();
        SiteVisit siteVisit = siteVisitRepository.findById(siteVisitId)
                .orElseThrow(() -> new ResourceNotFoundException("SiteVisit", "id", siteVisitId));

        if (!siteVisit.getCustomer().getId().equals(customer.getId())) {
            throw new ForbiddenException("You can only cancel your own site visit requests");
        }

        if (siteVisit.getStatus() == SiteVisitStatus.COMPLETED || siteVisit.getStatus() == SiteVisitStatus.CANCELLED) {
            throw new BadRequestException("Cannot cancel a site visit with status " + siteVisit.getStatus());
        }

        siteVisit.setStatus(SiteVisitStatus.CANCELLED);
        siteVisit = siteVisitRepository.save(siteVisit);
        log.info("Site visit {} cancelled by customer {}", siteVisitId, customer.getId());

        if (siteVisit.getProperty().getUser() != null) {
            notificationService.createNotification(
                    siteVisit.getProperty().getUser(),
                    "Site Visit Cancelled: " + siteVisit.getProperty().getTitle(),
                    customer.getFullName() + " has cancelled their site visit scheduled for " + siteVisit.getPreferredDate(),
                    NotificationType.SITE_VISIT,
                    siteVisit.getId()
            );
        }

        return mapToResponse(siteVisit);
    }

    @Transactional(readOnly = true)
    public PagedResponse<SiteVisitResponse> getCustomerSiteVisits(int page, int size) {
        User customer = authService.getCurrentAuthenticatedUser();
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<SiteVisit> siteVisits = siteVisitRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId(), pageRequest);

        List<SiteVisitResponse> content = siteVisits.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<SiteVisitResponse>builder()
                .content(content)
                .page(siteVisits.getNumber())
                .size(siteVisits.getSize())
                .totalElements(siteVisits.getTotalElements())
                .totalPages(siteVisits.getTotalPages())
                .last(siteVisits.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public PagedResponse<SiteVisitResponse> getBuilderSiteVisits(SiteVisitStatus status, int page, int size) {
        User builder = authService.getCurrentAuthenticatedUser();
        PageRequest pageRequest = PageRequest.of(page, size);

        Page<SiteVisit> siteVisits;
        if (status != null) {
            siteVisits = siteVisitRepository.findByBuilderIdAndStatus(builder.getId(), status, pageRequest);
        } else {
            siteVisits = siteVisitRepository.findByBuilderId(builder.getId(), pageRequest);
        }

        List<SiteVisitResponse> content = siteVisits.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<SiteVisitResponse>builder()
                .content(content)
                .page(siteVisits.getNumber())
                .size(siteVisits.getSize())
                .totalElements(siteVisits.getTotalElements())
                .totalPages(siteVisits.getTotalPages())
                .last(siteVisits.isLast())
                .build();
    }

    private SiteVisitResponse mapToResponse(SiteVisit siteVisit) {
        SiteVisitResponse response = new SiteVisitResponse();
        response.setId(siteVisit.getId());
        response.setPreferredDate(siteVisit.getPreferredDate());
        response.setPreferredTime(siteVisit.getPreferredTime());
        response.setMessage(siteVisit.getMessage());
        response.setStatus(siteVisit.getStatus());
        response.setResponseNote(siteVisit.getResponseNote());
        response.setCreatedAt(siteVisit.getCreatedAt());

        if (siteVisit.getCustomer() != null) {
            UserResponse userResp = new UserResponse();
            userResp.setId(siteVisit.getCustomer().getId());
            userResp.setFullName(siteVisit.getCustomer().getFullName());
            userResp.setEmail(siteVisit.getCustomer().getEmail());
            userResp.setPhone(siteVisit.getCustomer().getPhone());
            userResp.setRole(siteVisit.getCustomer().getRole());
            response.setCustomer(userResp);
        }

        if (siteVisit.getProperty() != null) {
            Property p = siteVisit.getProperty();
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
