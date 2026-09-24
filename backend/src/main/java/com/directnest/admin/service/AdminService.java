package com.directnest.admin.service;

import com.directnest.admin.dto.AdminDashboardStatsResponse;
import com.directnest.auth.service.AuthService;
import com.directnest.builder.dto.ProviderProfileResponse;
import com.directnest.builder.dto.VerifyProviderRequest;
import com.directnest.builder.entity.ProviderProfile;
import com.directnest.builder.entity.VerificationStatus;
import com.directnest.builder.repository.ProviderProfileRepository;
import com.directnest.builder.service.BuilderService;
import com.directnest.common.dto.PagedResponse;
import com.directnest.enquiry.repository.EnquiryRepository;
import com.directnest.exception.ResourceNotFoundException;
import com.directnest.notification.entity.NotificationType;
import com.directnest.notification.service.NotificationService;
import com.directnest.property.dto.PropertyDetailResponse;
import com.directnest.property.dto.PropertyListResponse;
import com.directnest.property.dto.VerifyPropertyRequest;
import com.directnest.property.entity.Property;
import com.directnest.property.entity.PropertyStatus;
import com.directnest.property.repository.PropertyRepository;
import com.directnest.property.service.PropertyService;
import com.directnest.report.entity.ReportStatus;
import com.directnest.report.repository.PropertyReportRepository;
import com.directnest.sitevisit.repository.SiteVisitRepository;
import com.directnest.user.dto.UserResponse;
import com.directnest.user.entity.Role;
import com.directnest.user.entity.User;
import com.directnest.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final PropertyRepository propertyRepository;
    private final EnquiryRepository enquiryRepository;
    private final SiteVisitRepository siteVisitRepository;
    private final PropertyReportRepository propertyReportRepository;
    private final BuilderService builderService;
    private final PropertyService propertyService;
    private final AuthService authService;
    private final NotificationService notificationService;

    public AdminService(UserRepository userRepository,
                        ProviderProfileRepository providerProfileRepository,
                        PropertyRepository propertyRepository,
                        EnquiryRepository enquiryRepository,
                        SiteVisitRepository siteVisitRepository,
                        PropertyReportRepository propertyReportRepository,
                        BuilderService builderService,
                        PropertyService propertyService,
                        AuthService authService,
                        NotificationService notificationService) {
        this.userRepository = userRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.propertyRepository = propertyRepository;
        this.enquiryRepository = enquiryRepository;
        this.siteVisitRepository = siteVisitRepository;
        this.propertyReportRepository = propertyReportRepository;
        this.builderService = builderService;
        this.propertyService = propertyService;
        this.authService = authService;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public AdminDashboardStatsResponse getDashboardStats() {
        AdminDashboardStatsResponse stats = new AdminDashboardStatsResponse();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalCustomers(userRepository.findAll().stream().filter(u -> u.getRole() == Role.CUSTOMER).count());
        stats.setTotalBuilders(userRepository.findAll().stream().filter(u -> u.getRole() == Role.BUILDER).count());
        stats.setTotalProperties(propertyRepository.count());
        stats.setApprovedProperties(propertyRepository.countByStatus(PropertyStatus.APPROVED));
        stats.setPendingProperties(propertyRepository.countByStatus(PropertyStatus.PENDING_VERIFICATION));
        stats.setRejectedProperties(propertyRepository.countByStatus(PropertyStatus.REJECTED));
        stats.setTotalEnquiries(enquiryRepository.count());
        stats.setTotalSiteVisits(siteVisitRepository.count());
        stats.setPendingVerifications(providerProfileRepository.findByVerificationStatus(VerificationStatus.PENDING, PageRequest.of(0, 1)).getTotalElements());
        stats.setOpenReports(propertyReportRepository.countByStatus(ReportStatus.OPEN));
        return stats;
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getUsers(Role role, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> userPage;
        if (role != null) {
            userPage = userRepository.findByRole(role, pageRequest);
        } else {
            userPage = userRepository.findAll(pageRequest);
        }

        List<UserResponse> content = userPage.getContent().stream()
                .map(authService::mapToUserResponse)
                .collect(Collectors.toList());

        return PagedResponse.<UserResponse>builder()
                .content(content)
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .last(userPage.isLast())
                .build();
    }

    @Transactional
    public UserResponse suspendUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setActive(false);
        user = userRepository.save(user);
        log.info("User {} suspended by admin", userId);
        return authService.mapToUserResponse(user);
    }

    @Transactional
    public UserResponse activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setActive(true);
        user = userRepository.save(user);
        log.info("User {} activated by admin", userId);
        return authService.mapToUserResponse(user);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProviderProfileResponse> getProviders(VerificationStatus status, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ProviderProfile> providerPage;
        if (status != null) {
            providerPage = providerProfileRepository.findByVerificationStatus(status, pageRequest);
        } else {
            providerPage = providerProfileRepository.findAll(pageRequest);
        }

        List<ProviderProfileResponse> content = providerPage.getContent().stream()
                .map(p -> builderService.mapToProfileResponse(p))
                .collect(Collectors.toList());

        return PagedResponse.<ProviderProfileResponse>builder()
                .content(content)
                .page(providerPage.getNumber())
                .size(providerPage.getSize())
                .totalElements(providerPage.getTotalElements())
                .totalPages(providerPage.getTotalPages())
                .last(providerPage.isLast())
                .build();
    }

    @Transactional
    public ProviderProfileResponse approveProvider(Long providerId) {
        VerifyProviderRequest req = new VerifyProviderRequest();
        req.setStatus(VerificationStatus.APPROVED);
        return builderService.verifyProvider(providerId, req);
    }

    @Transactional
    public ProviderProfileResponse rejectProvider(Long providerId, String reason) {
        VerifyProviderRequest req = new VerifyProviderRequest();
        req.setStatus(VerificationStatus.REJECTED);
        req.setNotes(reason);
        return builderService.verifyProvider(providerId, req);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PropertyListResponse> getProperties(PropertyStatus status, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Property> propertyPage;
        if (status != null) {
            propertyPage = propertyRepository.findByStatus(status, pageRequest);
        } else {
            propertyPage = propertyRepository.findAll(pageRequest);
        }

        List<PropertyListResponse> content = propertyPage.getContent().stream()
                .map(propertyService::mapToListResponse)
                .collect(Collectors.toList());

        return PagedResponse.<PropertyListResponse>builder()
                .content(content)
                .page(propertyPage.getNumber())
                .size(propertyPage.getSize())
                .totalElements(propertyPage.getTotalElements())
                .totalPages(propertyPage.getTotalPages())
                .last(propertyPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public PagedResponse<PropertyListResponse> getPendingProperties(int page, int size) {
        return getProperties(PropertyStatus.PENDING_VERIFICATION, page, size);
    }

    @Transactional(readOnly = true)
    public PropertyDetailResponse getPropertyForReview(Long propertyId) {
        return propertyService.getPropertyById(propertyId);
    }

    @Transactional
    public PropertyDetailResponse approveProperty(Long propertyId) {
        VerifyPropertyRequest req = new VerifyPropertyRequest();
        req.setStatus(PropertyStatus.APPROVED);
        PropertyDetailResponse res = propertyService.verifyProperty(propertyId, req);

        Property property = propertyRepository.findById(propertyId).orElse(null);
        if (property != null && property.getUser() != null) {
            notificationService.createNotification(
                    property.getUser(),
                    "Property Approved: " + property.getTitle(),
                    "Your property listing has been approved and is now live on DirectNest!",
                    NotificationType.PROPERTY_STATUS,
                    propertyId
            );
        }
        return res;
    }

    @Transactional
    public PropertyDetailResponse rejectProperty(Long propertyId, String reason) {
        VerifyPropertyRequest req = new VerifyPropertyRequest();
        req.setStatus(PropertyStatus.REJECTED);
        req.setRejectionReason(reason);
        PropertyDetailResponse res = propertyService.verifyProperty(propertyId, req);

        Property property = propertyRepository.findById(propertyId).orElse(null);
        if (property != null && property.getUser() != null) {
            notificationService.createNotification(
                    property.getUser(),
                    "Property Rejected: " + property.getTitle(),
                    "Your property listing was rejected. Reason: " + reason,
                    NotificationType.PROPERTY_STATUS,
                    propertyId
            );
        }
        return res;
    }
}
