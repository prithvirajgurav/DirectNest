package com.directnest.enquiry.service;

import com.directnest.auth.service.AuthService;
import com.directnest.common.dto.PagedResponse;
import com.directnest.enquiry.dto.CreateEnquiryRequest;
import com.directnest.enquiry.dto.EnquiryResponse;
import com.directnest.enquiry.dto.RespondEnquiryRequest;
import com.directnest.enquiry.entity.Enquiry;
import com.directnest.enquiry.entity.EnquiryStatus;
import com.directnest.enquiry.repository.EnquiryRepository;
import com.directnest.exception.ForbiddenException;
import com.directnest.exception.ResourceNotFoundException;
import com.directnest.notification.entity.NotificationType;
import com.directnest.notification.service.NotificationService;
import com.directnest.property.dto.PropertyListResponse;
import com.directnest.property.entity.Property;
import com.directnest.property.entity.PropertyImage;
import com.directnest.property.repository.PropertyImageRepository;
import com.directnest.property.repository.PropertyRepository;
import com.directnest.user.dto.UserResponse;
import com.directnest.user.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnquiryService {

    private static final Logger log = LoggerFactory.getLogger(EnquiryService.class);

    private final EnquiryRepository enquiryRepository;
    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final AuthService authService;
    private final NotificationService notificationService;

    public EnquiryService(EnquiryRepository enquiryRepository,
                          PropertyRepository propertyRepository,
                          PropertyImageRepository propertyImageRepository,
                          AuthService authService,
                          NotificationService notificationService) {
        this.enquiryRepository = enquiryRepository;
        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.authService = authService;
        this.notificationService = notificationService;
    }

    @Transactional
    public EnquiryResponse createEnquiry(CreateEnquiryRequest request) {
        User customer = authService.getCurrentAuthenticatedUser();
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", request.getPropertyId()));

        Enquiry enquiry = new Enquiry();
        enquiry.setProperty(property);
        enquiry.setCustomer(customer);
        enquiry.setMessage(request.getMessage());
        enquiry.setPhone(request.getPhone() != null ? request.getPhone() : customer.getPhone());
        enquiry.setStatus(EnquiryStatus.NEW);

        enquiry = enquiryRepository.save(enquiry);
        log.info("Enquiry {} created by customer {} for property {}", enquiry.getId(), customer.getId(), property.getId());

        // Notify property owner/builder
        if (property.getUser() != null) {
            notificationService.createNotification(
                    property.getUser(),
                    "New Enquiry on " + property.getTitle(),
                    customer.getFullName() + " sent an enquiry: \"" + (request.getMessage().length() > 60 ? request.getMessage().substring(0, 60) + "..." : request.getMessage()) + "\"",
                    NotificationType.ENQUIRY,
                    enquiry.getId()
            );
        }

        return mapToResponse(enquiry);
    }

    @Transactional
    public EnquiryResponse respondToEnquiry(Long enquiryId, RespondEnquiryRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Enquiry enquiry = enquiryRepository.findById(enquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry", "id", enquiryId));

        if (!enquiry.getProperty().getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You can only respond to enquiries on your own properties");
        }

        enquiry.setResponse(request.getResponse());
        enquiry.setRespondedAt(LocalDateTime.now());
        enquiry.setStatus(EnquiryStatus.RESPONDED);

        enquiry = enquiryRepository.save(enquiry);
        log.info("Enquiry {} responded by builder {}", enquiryId, currentUser.getId());

        // Notify customer
        notificationService.createNotification(
                enquiry.getCustomer(),
                "Response to your enquiry on " + enquiry.getProperty().getTitle(),
                currentUser.getFullName() + " responded: \"" + (request.getResponse().length() > 60 ? request.getResponse().substring(0, 60) + "..." : request.getResponse()) + "\"",
                NotificationType.ENQUIRY,
                enquiry.getId()
        );

        return mapToResponse(enquiry);
    }

    @Transactional(readOnly = true)
    public PagedResponse<EnquiryResponse> getCustomerEnquiries(int page, int size) {
        User customer = authService.getCurrentAuthenticatedUser();
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Enquiry> enquiries = enquiryRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId(), pageRequest);

        List<EnquiryResponse> content = enquiries.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<EnquiryResponse>builder()
                .content(content)
                .page(enquiries.getNumber())
                .size(enquiries.getSize())
                .totalElements(enquiries.getTotalElements())
                .totalPages(enquiries.getTotalPages())
                .last(enquiries.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public PagedResponse<EnquiryResponse> getBuilderEnquiries(EnquiryStatus status, int page, int size) {
        User builder = authService.getCurrentAuthenticatedUser();
        PageRequest pageRequest = PageRequest.of(page, size);

        Page<Enquiry> enquiries;
        if (status != null) {
            enquiries = enquiryRepository.findByBuilderIdAndStatus(builder.getId(), status, pageRequest);
        } else {
            enquiries = enquiryRepository.findByBuilderId(builder.getId(), pageRequest);
        }

        List<EnquiryResponse> content = enquiries.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<EnquiryResponse>builder()
                .content(content)
                .page(enquiries.getNumber())
                .size(enquiries.getSize())
                .totalElements(enquiries.getTotalElements())
                .totalPages(enquiries.getTotalPages())
                .last(enquiries.isLast())
                .build();
    }

    private EnquiryResponse mapToResponse(Enquiry enquiry) {
        EnquiryResponse response = new EnquiryResponse();
        response.setId(enquiry.getId());
        response.setMessage(enquiry.getMessage());
        response.setPhone(enquiry.getPhone());
        response.setStatus(enquiry.getStatus());
        response.setResponse(enquiry.getResponse());
        response.setRespondedAt(enquiry.getRespondedAt());
        response.setCreatedAt(enquiry.getCreatedAt());

        if (enquiry.getCustomer() != null) {
            UserResponse userResp = new UserResponse();
            userResp.setId(enquiry.getCustomer().getId());
            userResp.setFullName(enquiry.getCustomer().getFullName());
            userResp.setEmail(enquiry.getCustomer().getEmail());
            userResp.setPhone(enquiry.getCustomer().getPhone());
            userResp.setRole(enquiry.getCustomer().getRole());
            response.setCustomer(userResp);
        }

        if (enquiry.getProperty() != null) {
            Property p = enquiry.getProperty();
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
