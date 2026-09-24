package com.directnest.property.controller;

import com.directnest.common.dto.ApiResponse;
import com.directnest.common.dto.PagedResponse;
import com.directnest.property.dto.*;
import com.directnest.property.entity.PropertyStatus;
import com.directnest.property.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/builder/properties")
@PreAuthorize("hasRole('BUILDER')")
@Tag(name = "Builder Properties", description = "Builder property listing management (Create, Update, Upload Media, Submit for Verification)")
public class PropertyBuilderController {

    private final PropertyService propertyService;

    public PropertyBuilderController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping
    @Operation(summary = "Create a new property listing (Created as DRAFT)")
    public ResponseEntity<ApiResponse<PropertyDetailResponse>> createProperty(@Valid @RequestBody CreatePropertyRequest request) {
        PropertyDetailResponse response = propertyService.createProperty(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Property listing created as DRAFT", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update property listing (Only allowed in DRAFT / REJECTED status)")
    public ResponseEntity<ApiResponse<PropertyDetailResponse>> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePropertyRequest request
    ) {
        PropertyDetailResponse response = propertyService.updateProperty(id, request);
        return ResponseEntity.ok(ApiResponse.success("Property listing updated", response));
    }

    @GetMapping
    @Operation(summary = "Get current builder's properties with optional status filter")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyListResponse>>> getMyProperties(
            @RequestParam(required = false) PropertyStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<PropertyListResponse> response = propertyService.getMyProperties(status, page, size);
        return ResponseEntity.ok(ApiResponse.success("My properties retrieved", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get current builder's property by ID")
    public ResponseEntity<ApiResponse<PropertyDetailResponse>> getPropertyById(@PathVariable Long id) {
        PropertyDetailResponse response = propertyService.getPropertyById(id);
        return ResponseEntity.ok(ApiResponse.success("Property retrieved", response));
    }

    @PostMapping("/{id}/submit")
    @Operation(summary = "Submit property listing for admin verification")
    public ResponseEntity<ApiResponse<PropertyDetailResponse>> submitProperty(@PathVariable Long id) {
        PropertyDetailResponse response = propertyService.submitPropertyForVerification(id);
        return ResponseEntity.ok(ApiResponse.success("Property submitted for verification", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete property listing (Only DRAFT / REJECTED)")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok(ApiResponse.ok("Property deleted successfully"));
    }

    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image for property listing")
    public ResponseEntity<ApiResponse<PropertyImageDto>> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isPrimary", defaultValue = "false") boolean isPrimary
    ) {
        PropertyImageDto response = propertyService.uploadPropertyImage(id, file, isPrimary);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Image uploaded successfully", response));
    }

    @DeleteMapping("/{id}/images/{imageId}")
    @Operation(summary = "Delete image from property listing")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @PathVariable Long id,
            @PathVariable Long imageId
    ) {
        propertyService.deletePropertyImage(id, imageId);
        return ResponseEntity.ok(ApiResponse.ok("Image deleted successfully"));
    }

    @PutMapping("/{id}/images/{imageId}/primary")
    @Operation(summary = "Set primary cover image for property listing")
    public ResponseEntity<ApiResponse<PropertyImageDto>> setPrimaryImage(
            @PathVariable Long id,
            @PathVariable Long imageId
    ) {
        PropertyImageDto response = propertyService.setPrimaryImage(id, imageId);
        return ResponseEntity.ok(ApiResponse.success("Primary image set successfully", response));
    }

    @PostMapping(value = "/{id}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload legal/compliance document for property listing")
    public ResponseEntity<ApiResponse<PropertyDocumentDto>> uploadDocument(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "documentType", defaultValue = "OTHER") String documentType
    ) {
        PropertyDocumentDto response = propertyService.uploadPropertyDocument(id, documentType, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Document uploaded successfully", response));
    }

    @DeleteMapping("/{id}/documents/{documentId}")
    @Operation(summary = "Delete document from property listing")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(
            @PathVariable Long id,
            @PathVariable Long documentId
    ) {
        propertyService.deletePropertyDocument(id, documentId);
        return ResponseEntity.ok(ApiResponse.ok("Document deleted successfully"));
    }
}
