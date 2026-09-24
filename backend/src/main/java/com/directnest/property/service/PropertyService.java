package com.directnest.property.service;

import com.directnest.amenity.entity.Amenity;
import com.directnest.amenity.repository.AmenityRepository;
import com.directnest.auth.service.AuthService;
import com.directnest.builder.repository.ProviderProfileRepository;
import com.directnest.builder.service.BuilderService;
import com.directnest.common.dto.PagedResponse;
import com.directnest.config.FileStorageService;
import com.directnest.exception.BadRequestException;
import com.directnest.exception.ForbiddenException;
import com.directnest.exception.ResourceNotFoundException;
import com.directnest.property.dto.*;
import com.directnest.property.entity.*;
import com.directnest.property.repository.PropertyDocumentRepository;
import com.directnest.property.repository.PropertyImageRepository;
import com.directnest.property.repository.PropertyRepository;
import com.directnest.property.specification.PropertySpecification;
import com.directnest.user.entity.Role;
import com.directnest.user.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private static final Logger log = LoggerFactory.getLogger(PropertyService.class);

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final PropertyDocumentRepository propertyDocumentRepository;
    private final AmenityRepository amenityRepository;
    private final AuthService authService;
    private final FileStorageService fileStorageService;
    private final ProviderProfileRepository providerProfileRepository;
    private final BuilderService builderService;

    public PropertyService(PropertyRepository propertyRepository,
                           PropertyImageRepository propertyImageRepository,
                           PropertyDocumentRepository propertyDocumentRepository,
                           AmenityRepository amenityRepository,
                           AuthService authService,
                           FileStorageService fileStorageService,
                           ProviderProfileRepository providerProfileRepository,
                           BuilderService builderService) {
        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.propertyDocumentRepository = propertyDocumentRepository;
        this.amenityRepository = amenityRepository;
        this.authService = authService;
        this.fileStorageService = fileStorageService;
        this.providerProfileRepository = providerProfileRepository;
        this.builderService = builderService;
    }

    @Transactional
    public PropertyDetailResponse createProperty(CreatePropertyRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();

        if (currentUser.getRole() != Role.BUILDER) {
            throw new ForbiddenException("Only BUILDER users can create properties");
        }

        Set<Amenity> amenities = new HashSet<>();
        if (request.getAmenityIds() != null && !request.getAmenityIds().isEmpty()) {
            amenities = new HashSet<>(amenityRepository.findAllById(request.getAmenityIds()));
        }

        Property property = Property.builder()
                .user(currentUser)
                .title(request.getTitle())
                .description(request.getDescription())
                .propertyType(request.getPropertyType())
                .listingType(request.getListingType())
                .price(request.getPrice())
                .priceNegotiable(request.isPriceNegotiable())
                .areaSqft(request.getAreaSqft())
                .bedrooms(request.getBedrooms())
                .bathrooms(request.getBathrooms())
                .balconies(request.getBalconies())
                .floorNumber(request.getFloorNumber())
                .totalFloors(request.getTotalFloors())
                .furnishingStatus(request.getFurnishingStatus())
                .possessionDate(request.getPossessionDate())
                .addressLine(request.getAddressLine())
                .locality(request.getLocality())
                .city(request.getCity())
                .state(request.getState() != null ? request.getState() : "Karnataka")
                .pincode(request.getPincode() != null ? request.getPincode() : "560001")
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(PropertyStatus.DRAFT)
                .amenities(amenities)
                .build();

        property = propertyRepository.save(property);
        log.info("Created property id: {} by user: {}", property.getId(), currentUser.getId());

        return mapToDetailResponse(property);
    }

    @Transactional
    public PropertyDetailResponse updateProperty(Long propertyId, UpdatePropertyRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Property property = propertyRepository.findByIdWithAmenities(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        if (!property.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You can only update your own properties");
        }

        if (property.getStatus() == PropertyStatus.APPROVED || property.getStatus() == PropertyStatus.SOLD) {
            throw new BadRequestException("Cannot update property in " + property.getStatus() + " status");
        }

        if (request.getTitle() != null) property.setTitle(request.getTitle());
        if (request.getDescription() != null) property.setDescription(request.getDescription());
        if (request.getPropertyType() != null) property.setPropertyType(request.getPropertyType());
        if (request.getListingType() != null) property.setListingType(request.getListingType());
        if (request.getPrice() != null) property.setPrice(request.getPrice());
        if (request.getPriceNegotiable() != null) property.setPriceNegotiable(request.getPriceNegotiable());
        if (request.getAreaSqft() != null) property.setAreaSqft(request.getAreaSqft());
        if (request.getBedrooms() != null) property.setBedrooms(request.getBedrooms());
        if (request.getBathrooms() != null) property.setBathrooms(request.getBathrooms());
        if (request.getBalconies() != null) property.setBalconies(request.getBalconies());
        if (request.getFloorNumber() != null) property.setFloorNumber(request.getFloorNumber());
        if (request.getTotalFloors() != null) property.setTotalFloors(request.getTotalFloors());
        if (request.getFurnishingStatus() != null) property.setFurnishingStatus(request.getFurnishingStatus());
        if (request.getPossessionDate() != null) property.setPossessionDate(request.getPossessionDate());
        if (request.getAddressLine() != null) property.setAddressLine(request.getAddressLine());
        if (request.getLocality() != null) property.setLocality(request.getLocality());
        if (request.getCity() != null) property.setCity(request.getCity());
        if (request.getState() != null) property.setState(request.getState());
        if (request.getPincode() != null) property.setPincode(request.getPincode());
        if (request.getLatitude() != null) property.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) property.setLongitude(request.getLongitude());

        if (request.getAmenityIds() != null) {
            Set<Amenity> amenities = new HashSet<>(amenityRepository.findAllById(request.getAmenityIds()));
            property.setAmenities(amenities);
        }

        property = propertyRepository.save(property);
        log.info("Updated property id: {}", propertyId);

        return mapToDetailResponse(property);
    }

    @Transactional
    public PropertyDetailResponse submitPropertyForVerification(Long propertyId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Property property = propertyRepository.findByIdWithAmenities(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        if (!property.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You can only submit your own properties");
        }

        if (property.getStatus() != PropertyStatus.DRAFT && property.getStatus() != PropertyStatus.REJECTED) {
            throw new BadRequestException("Property must be in DRAFT or REJECTED status to submit for verification");
        }

        List<PropertyImage> images = propertyImageRepository.findByPropertyIdOrderByDisplayOrderAsc(propertyId);
        if (images.isEmpty()) {
            throw new BadRequestException("Property must have at least one image before submission");
        }

        property.setStatus(PropertyStatus.PENDING_VERIFICATION);
        property = propertyRepository.save(property);
        log.info("Property {} submitted for verification by user {}", propertyId, currentUser.getId());

        return mapToDetailResponse(property);
    }

    @Transactional
    public void deleteProperty(Long propertyId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        if (!property.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You can only delete your own properties");
        }

        if (property.getStatus() == PropertyStatus.APPROVED) {
            throw new BadRequestException("Cannot delete approved property. Change status to DELISTED first.");
        }

        // Delete associated images and documents from storage
        List<PropertyImage> images = propertyImageRepository.findByPropertyIdOrderByDisplayOrderAsc(propertyId);
        images.forEach(img -> fileStorageService.deleteFile(img.getImageUrl()));

        List<PropertyDocument> documents = propertyDocumentRepository.findByPropertyId(propertyId);
        documents.forEach(doc -> fileStorageService.deleteFile(doc.getDocumentUrl()));

        propertyRepository.delete(property);
        log.info("Deleted property id: {} by user: {}", propertyId, currentUser.getId());
    }

    @Transactional(readOnly = true)
    public PropertyDetailResponse getPropertyById(Long propertyId) {
        Property property = propertyRepository.findByIdWithAmenities(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        return mapToDetailResponse(property);
    }

    @Transactional
    public void incrementViews(Long propertyId) {
        propertyRepository.incrementViewsCount(propertyId);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PropertyListResponse> searchProperties(PropertySearchFilter filter, int page, int size, String sortBy, String sortDir) {
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = validateSortField(sortBy);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, sortField));

        Specification<Property> spec = PropertySpecification.withFilters(filter);
        Page<Property> propertyPage = propertyRepository.findAll(spec, pageRequest);

        List<PropertyListResponse> content = propertyPage.getContent().stream()
                .map(this::mapToListResponse)
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
    public PagedResponse<PropertyListResponse> getMyProperties(PropertyStatus status, int page, int size) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Property> propertyPage;
        if (status != null) {
            propertyPage = propertyRepository.findByUserIdAndStatus(currentUser.getId(), status, pageRequest);
        } else {
            propertyPage = propertyRepository.findByUserId(currentUser.getId(), pageRequest);
        }

        List<PropertyListResponse> content = propertyPage.getContent().stream()
                .map(this::mapToListResponse)
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

    @Transactional
    public PropertyImageDto uploadPropertyImage(Long propertyId, MultipartFile file, boolean setPrimary) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        if (!property.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You can only upload images to your own properties");
        }

        String imageUrl = fileStorageService.storeImage(file);

        List<PropertyImage> existingImages = propertyImageRepository.findByPropertyIdOrderByDisplayOrderAsc(propertyId);
        int nextOrder = existingImages.size();

        if (setPrimary || existingImages.isEmpty()) {
            propertyImageRepository.unsetPrimaryForProperty(propertyId);
            setPrimary = true;
        }

        PropertyImage propertyImage = PropertyImage.builder()
                .property(property)
                .imageUrl(imageUrl)
                .primary(setPrimary)
                .displayOrder(nextOrder)
                .build();

        propertyImage = propertyImageRepository.save(propertyImage);
        log.info("Uploaded image for property: {}", propertyId);

        return mapToImageDto(propertyImage);
    }

    @Transactional
    public void deletePropertyImage(Long propertyId, Long imageId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        if (!property.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You can only delete images from your own properties");
        }

        PropertyImage image = propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("PropertyImage", "id", imageId));

        if (!image.getProperty().getId().equals(propertyId)) {
            throw new BadRequestException("Image does not belong to this property");
        }

        fileStorageService.deleteFile(image.getImageUrl());
        propertyImageRepository.delete(image);
        log.info("Deleted image id: {} from property: {}", imageId, propertyId);
    }

    @Transactional
    public PropertyImageDto setPrimaryImage(Long propertyId, Long imageId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        if (!property.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You can only update images of your own properties");
        }

        PropertyImage image = propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("PropertyImage", "id", imageId));

        if (!image.getProperty().getId().equals(propertyId)) {
            throw new BadRequestException("Image does not belong to this property");
        }

        propertyImageRepository.unsetPrimaryForProperty(propertyId);
        image.setPrimary(true);
        image = propertyImageRepository.save(image);
        log.info("Set primary image id: {} for property: {}", imageId, propertyId);

        return mapToImageDto(image);
    }

    @Transactional
    public PropertyDocumentDto uploadPropertyDocument(Long propertyId, String documentType, MultipartFile file) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        if (!property.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You can only upload documents to your own properties");
        }

        String documentUrl = fileStorageService.storeDocument(file);

        PropertyDocument document = PropertyDocument.builder()
                .property(property)
                .documentType(documentType)
                .documentUrl(documentUrl)
                .build();

        document = propertyDocumentRepository.save(document);
        log.info("Uploaded document id: {} for property: {}", document.getId(), propertyId);

        return mapToDocumentDto(document);
    }

    @Transactional
    public void deletePropertyDocument(Long propertyId, Long documentId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        if (!property.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You can only delete documents from your own properties");
        }

        PropertyDocument document = propertyDocumentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("PropertyDocument", "id", documentId));

        if (!document.getProperty().getId().equals(propertyId)) {
            throw new BadRequestException("Document does not belong to this property");
        }

        fileStorageService.deleteFile(document.getDocumentUrl());
        propertyDocumentRepository.delete(document);
        log.info("Deleted document id: {} from property: {}", documentId, propertyId);
    }

    @Transactional
    public PropertyDetailResponse verifyProperty(Long propertyId, VerifyPropertyRequest request) {
        Property property = propertyRepository.findByIdWithAmenities(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        if (property.getStatus() != PropertyStatus.PENDING_VERIFICATION) {
            throw new BadRequestException("Property must be in PENDING_VERIFICATION status");
        }

        if (request.getStatus() != PropertyStatus.APPROVED && request.getStatus() != PropertyStatus.REJECTED) {
            throw new BadRequestException("Status must be APPROVED or REJECTED");
        }

        property.setStatus(request.getStatus());
        property.setAdminNotes(request.getAdminNotes());
        property.setRejectionReason(request.getRejectionReason());
        property.setVerifiedAt(LocalDateTime.now());

        property = propertyRepository.save(property);
        log.info("Property {} verification status changed to: {}", propertyId, request.getStatus());

        return mapToDetailResponse(property);
    }

    private String validateSortField(String sortBy) {
        if (sortBy == null) return "createdAt";
        switch (sortBy) {
            case "price":
            case "areaSqft":
            case "bedrooms":
            case "createdAt":
            case "viewsCount":
                return sortBy;
            default:
                return "createdAt";
        }
    }

    private PropertyDetailResponse mapToDetailResponse(Property property) {
        PropertyDetailResponse response = new PropertyDetailResponse();
        response.setId(property.getId());
        response.setOwner(authService.mapToUserResponse(property.getUser()));

        if (property.getUser() != null) {
            providerProfileRepository.findByUserId(property.getUser().getId())
                    .ifPresent(profile -> response.setProvider(builderService.mapToProfileResponse(profile)));
        }

        response.setTitle(property.getTitle());
        response.setDescription(property.getDescription());
        response.setPropertyType(property.getPropertyType());
        response.setListingType(property.getListingType());
        response.setPrice(property.getPrice());
        response.setPriceNegotiable(property.isPriceNegotiable());
        response.setAreaSqft(property.getAreaSqft());
        response.setBedrooms(property.getBedrooms());
        response.setBathrooms(property.getBathrooms());
        response.setBalconies(property.getBalconies());
        response.setFloorNumber(property.getFloorNumber());
        response.setTotalFloors(property.getTotalFloors());
        response.setFurnishingStatus(property.getFurnishingStatus());
        response.setPossessionDate(property.getPossessionDate());
        response.setAddressLine(property.getAddressLine());
        response.setLocality(property.getLocality());
        response.setCity(property.getCity());
        response.setState(property.getState());
        response.setPincode(property.getPincode());
        response.setLatitude(property.getLatitude());
        response.setLongitude(property.getLongitude());
        response.setStatus(property.getStatus());
        response.setAdminNotes(property.getAdminNotes());
        response.setRejectionReason(property.getRejectionReason());
        response.setVerifiedAt(property.getVerifiedAt());
        response.setFeatured(property.isFeatured());
        response.setViewsCount(property.getViewsCount());
        if (property.getAmenities() != null) {
            try {
                response.setAmenities(new HashSet<>(property.getAmenities()));
            } catch (Exception e) {
                response.setAmenities(Collections.emptySet());
            }
        } else {
            response.setAmenities(Collections.emptySet());
        }

        List<PropertyImage> images = propertyImageRepository.findByPropertyIdOrderByDisplayOrderAsc(property.getId());
        response.setImages(images.stream().map(this::mapToImageDto).collect(Collectors.toList()));

        List<PropertyDocument> documents = propertyDocumentRepository.findByPropertyId(property.getId());
        response.setDocuments(documents.stream().map(this::mapToDocumentDto).collect(Collectors.toList()));

        response.setCreatedAt(property.getCreatedAt());
        response.setUpdatedAt(property.getUpdatedAt());

        return response;
    }

    public PropertyListResponse mapToListResponse(Property property) {
        PropertyListResponse response = new PropertyListResponse();
        response.setId(property.getId());
        if (property.getUser() != null) {
            response.setOwnerId(property.getUser().getId());
            response.setOwnerName(property.getUser().getFullName());
            response.setOwnerEmail(property.getUser().getEmail());
            response.setOwnerPhone(property.getUser().getPhone());
        }
        response.setTitle(property.getTitle());
        response.setPropertyType(property.getPropertyType());
        response.setListingType(property.getListingType());
        response.setPrice(property.getPrice());
        response.setPriceNegotiable(property.isPriceNegotiable());
        response.setAreaSqft(property.getAreaSqft());
        response.setBedrooms(property.getBedrooms());
        response.setBathrooms(property.getBathrooms());
        response.setFurnishingStatus(property.getFurnishingStatus());
        response.setLocality(property.getLocality());
        response.setCity(property.getCity());
        response.setState(property.getState());
        response.setStatus(property.getStatus());
        response.setFeatured(property.isFeatured());
        response.setViewsCount(property.getViewsCount());
        response.setCreatedAt(property.getCreatedAt());

        Optional<PropertyImage> primaryImage = propertyImageRepository.findByPropertyIdAndPrimaryTrue(property.getId());
        primaryImage.ifPresent(img -> response.setPrimaryImageUrl(img.getImageUrl()));

        return response;
    }

    private PropertyImageDto mapToImageDto(PropertyImage image) {
        return PropertyImageDto.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .primary(image.isPrimary())
                .displayOrder(image.getDisplayOrder())
                .createdAt(image.getCreatedAt())
                .build();
    }

    private PropertyDocumentDto mapToDocumentDto(PropertyDocument document) {
        return PropertyDocumentDto.builder()
                .id(document.getId())
                .documentType(document.getDocumentType())
                .documentUrl(document.getDocumentUrl())
                .createdAt(document.getCreatedAt())
                .build();
    }
}
