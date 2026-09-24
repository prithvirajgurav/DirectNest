package com.directnest.builder.service;

import com.directnest.auth.service.AuthService;
import com.directnest.builder.dto.*;
import com.directnest.builder.entity.ProviderDocument;
import com.directnest.builder.entity.ProviderProfile;
import com.directnest.builder.entity.ProviderType;
import com.directnest.builder.entity.VerificationStatus;
import com.directnest.builder.repository.ProviderDocumentRepository;
import com.directnest.builder.repository.ProviderProfileRepository;
import com.directnest.common.dto.PagedResponse;
import com.directnest.config.FileStorageService;
import com.directnest.exception.BadRequestException;
import com.directnest.exception.ForbiddenException;
import com.directnest.exception.ResourceNotFoundException;
import com.directnest.user.entity.Role;
import com.directnest.user.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BuilderService {

    private static final Logger log = LoggerFactory.getLogger(BuilderService.class);

    private final ProviderProfileRepository providerProfileRepository;
    private final ProviderDocumentRepository providerDocumentRepository;
    private final AuthService authService;
    private final FileStorageService fileStorageService;

    public BuilderService(ProviderProfileRepository providerProfileRepository,
                          ProviderDocumentRepository providerDocumentRepository,
                          AuthService authService,
                          FileStorageService fileStorageService) {
        this.providerProfileRepository = providerProfileRepository;
        this.providerDocumentRepository = providerDocumentRepository;
        this.authService = authService;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public ProviderProfile getOrCreateCurrentProviderProfile() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser.getRole() != Role.BUILDER) {
            throw new ForbiddenException("Only BUILDER role users can have provider profiles");
        }

        return providerProfileRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> {
                    String name = currentUser.getFullName() != null && !currentUser.getFullName().trim().isEmpty()
                            ? currentUser.getFullName()
                            : "Builder Partner";
                    ProviderProfile newProfile = ProviderProfile.builder()
                            .user(currentUser)
                            .providerType(ProviderType.BUILDER)
                            .companyName(name)
                            .companyCity("Bangalore")
                            .companyState("Karnataka")
                            .companyPincode("560001")
                            .verificationStatus(VerificationStatus.PENDING_VERIFICATION)
                            .build();
                    return providerProfileRepository.save(newProfile);
                });
    }

    @Transactional
    public ProviderProfileResponse createProviderProfile(CreateProviderProfileRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();

        if (currentUser.getRole() != Role.BUILDER) {
            throw new ForbiddenException("Only BUILDER role users can create provider profiles");
        }

        ProviderProfile profile = providerProfileRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> ProviderProfile.builder().user(currentUser).build());

        profile.setProviderType(request.getProviderType() != null ? request.getProviderType() : ProviderType.BUILDER);
        profile.setCompanyName(request.getCompanyName() != null ? request.getCompanyName() : currentUser.getFullName());
        profile.setCompanyDescription(request.getCompanyDescription());
        profile.setCompanyAddress(request.getCompanyAddress());
        profile.setCompanyCity(request.getCompanyCity() != null ? request.getCompanyCity() : "Bangalore");
        profile.setCompanyState(request.getCompanyState() != null ? request.getCompanyState() : "Karnataka");
        profile.setCompanyPincode(request.getCompanyPincode() != null ? request.getCompanyPincode() : "560001");
        profile.setGstin(request.getGstin());
        profile.setYearsOfExperience(request.getYearsOfExperience());
        profile.setWebsiteUrl(request.getWebsiteUrl());
        if (profile.getVerificationStatus() == null) {
            profile.setVerificationStatus(VerificationStatus.PENDING_VERIFICATION);
        }

        profile = providerProfileRepository.save(profile);
        log.info("Saved provider profile id: {} for user: {}", profile.getId(), currentUser.getId());

        return mapToResponse(profile);
    }

    @Transactional
    public ProviderProfileResponse updateProviderProfile(UpdateProviderProfileRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        ProviderProfile profile = getOrCreateCurrentProviderProfile();

        if (request.getProviderType() != null) {
            profile.setProviderType(request.getProviderType());
        }
        if (request.getCompanyName() != null && !request.getCompanyName().trim().isEmpty()) {
            profile.setCompanyName(request.getCompanyName());
        }
        if (request.getCompanyDescription() != null) {
            profile.setCompanyDescription(request.getCompanyDescription());
        }
        if (request.getCompanyAddress() != null) {
            profile.setCompanyAddress(request.getCompanyAddress());
        }
        if (request.getCompanyCity() != null) {
            profile.setCompanyCity(request.getCompanyCity());
        }
        if (request.getCompanyState() != null) {
            profile.setCompanyState(request.getCompanyState());
        }
        if (request.getCompanyPincode() != null) {
            profile.setCompanyPincode(request.getCompanyPincode());
        }
        if (request.getGstin() != null) {
            profile.setGstin(request.getGstin());
        }
        if (request.getYearsOfExperience() != null) {
            profile.setYearsOfExperience(request.getYearsOfExperience());
        }
        if (request.getWebsiteUrl() != null) {
            profile.setWebsiteUrl(request.getWebsiteUrl());
        }

        profile = providerProfileRepository.save(profile);
        log.info("Updated provider profile id: {}", profile.getId());

        return mapToResponse(profile);
    }

    @Transactional
    public ProviderProfileResponse getMyProviderProfile() {
        ProviderProfile profile = getOrCreateCurrentProviderProfile();
        return mapToResponse(profile);
    }

    @Transactional(readOnly = true)
    public ProviderProfileResponse getProviderProfileById(Long id) {
        ProviderProfile profile = providerProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile", "id", id));
        return mapToResponse(profile);
    }

    @Transactional
    public ProviderProfileResponse submitForVerification() {
        ProviderProfile profile = getOrCreateCurrentProviderProfile();
        profile.setVerificationStatus(VerificationStatus.PENDING_VERIFICATION);
        profile = providerProfileRepository.save(profile);
        log.info("Submitted provider profile id: {} for verification", profile.getId());
        return mapToResponse(profile);
    }

    @Transactional
    public ProviderDocumentDto uploadProviderDocument(String documentType, MultipartFile file) {
        ProviderProfile profile = getOrCreateCurrentProviderProfile();

        String documentUrl = fileStorageService.storeDocument(file);

        ProviderDocument document = ProviderDocument.builder()
                .providerProfile(profile)
                .documentType(documentType)
                .documentUrl(documentUrl)
                .build();

        document = providerDocumentRepository.save(document);
        log.info("Uploaded verification document id: {} for provider: {}", document.getId(), profile.getId());

        return mapToDocumentDto(document);
    }

    @Transactional
    public void deleteProviderDocument(Long documentId) {
        ProviderProfile profile = getOrCreateCurrentProviderProfile();

        ProviderDocument document = providerDocumentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "id", documentId));

        if (!document.getProviderProfile().getId().equals(profile.getId())) {
            throw new ForbiddenException("You can only delete your own documents");
        }

        fileStorageService.deleteFile(document.getDocumentUrl());
        providerDocumentRepository.delete(document);
        log.info("Deleted provider document id: {}", documentId);
    }

    @Transactional(readOnly = true)
    public List<ProviderDocumentDto> getMyDocuments() {
        ProviderProfile profile = getOrCreateCurrentProviderProfile();
        List<ProviderDocument> documents = providerDocumentRepository.findByProviderProfileId(profile.getId());
        return documents.stream().map(this::mapToDocumentDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProviderProfileResponse> searchProviders(VerificationStatus status, ProviderType type,
                                                                  String city, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ProviderProfile> providerPage = providerProfileRepository.searchProviders(status, type, city, pageRequest);

        List<ProviderProfileResponse> content = providerPage.getContent().stream()
                .map(this::mapToResponse)
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
    public ProviderProfileResponse verifyProvider(Long providerId, VerifyProviderRequest request) {
        ProviderProfile profile = providerProfileRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile", "id", providerId));

        if (request.getStatus() != VerificationStatus.APPROVED && request.getStatus() != VerificationStatus.REJECTED) {
            throw new BadRequestException("Verification status must be APPROVED or REJECTED");
        }

        profile.setVerificationStatus(request.getStatus());
        profile.setVerificationNotes(request.getNotes());
        profile.setVerifiedAt(LocalDateTime.now());

        profile = providerProfileRepository.save(profile);
        log.info("Provider {} verification status changed to: {}", providerId, request.getStatus());

        return mapToResponse(profile);
    }

    public ProviderProfileResponse mapToProfileResponse(ProviderProfile profile) {
        return mapToResponse(profile);
    }

    private ProviderProfileResponse mapToResponse(ProviderProfile profile) {
        List<ProviderDocument> documents = providerDocumentRepository.findByProviderProfileId(profile.getId());
        List<ProviderDocumentDto> documentDtos = documents.stream()
                .map(this::mapToDocumentDto)
                .collect(Collectors.toList());

        return ProviderProfileResponse.builder()
                .id(profile.getId())
                .user(authService.mapToUserResponse(profile.getUser()))
                .providerType(profile.getProviderType())
                .companyName(profile.getCompanyName())
                .companyDescription(profile.getCompanyDescription())
                .companyAddress(profile.getCompanyAddress())
                .companyCity(profile.getCompanyCity())
                .companyState(profile.getCompanyState())
                .companyPincode(profile.getCompanyPincode())
                .gstin(profile.getGstin())
                .yearsOfExperience(profile.getYearsOfExperience())
                .websiteUrl(profile.getWebsiteUrl())
                .verificationStatus(profile.getVerificationStatus())
                .verificationNotes(profile.getVerificationNotes())
                .verifiedAt(profile.getVerifiedAt())
                .documents(documentDtos)
                .createdAt(profile.getCreatedAt())
                .build();
    }

    private ProviderDocumentDto mapToDocumentDto(ProviderDocument document) {
        return ProviderDocumentDto.builder()
                .id(document.getId())
                .documentType(document.getDocumentType())
                .documentUrl(document.getDocumentUrl())
                .createdAt(document.getCreatedAt())
                .build();
    }
}
