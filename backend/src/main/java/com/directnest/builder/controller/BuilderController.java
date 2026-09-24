package com.directnest.builder.controller;

import com.directnest.builder.dto.CreateProviderProfileRequest;
import com.directnest.builder.dto.ProviderDocumentDto;
import com.directnest.builder.dto.ProviderProfileResponse;
import com.directnest.builder.dto.UpdateProviderProfileRequest;
import com.directnest.builder.service.BuilderService;
import com.directnest.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/builder")
@PreAuthorize("hasRole('BUILDER')")
@Tag(name = "Builder Profile", description = "Builder / Property Owner profile and verification documents")
public class BuilderController {

    private final BuilderService builderService;

    public BuilderController(BuilderService builderService) {
        this.builderService = builderService;
    }

    @PostMapping("/profile")
    @Operation(summary = "Create builder / provider profile")
    public ResponseEntity<ApiResponse<ProviderProfileResponse>> createProfile(@Valid @RequestBody CreateProviderProfileRequest request) {
        ProviderProfileResponse response = builderService.createProviderProfile(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Provider profile created successfully", response));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update builder / provider profile")
    public ResponseEntity<ApiResponse<ProviderProfileResponse>> updateProfile(@Valid @RequestBody UpdateProviderProfileRequest request) {
        ProviderProfileResponse response = builderService.updateProviderProfile(request);
        return ResponseEntity.ok(ApiResponse.success("Provider profile updated successfully", response));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get current builder profile")
    public ResponseEntity<ApiResponse<ProviderProfileResponse>> getMyProfile() {
        ProviderProfileResponse response = builderService.getMyProviderProfile();
        return ResponseEntity.ok(ApiResponse.success("Provider profile fetched", response));
    }

    @PostMapping("/verification")
    @Operation(summary = "Submit builder profile for verification")
    public ResponseEntity<ApiResponse<ProviderProfileResponse>> submitVerification() {
        ProviderProfileResponse response = builderService.submitForVerification();
        return ResponseEntity.ok(ApiResponse.success("Profile submitted for verification", response));
    }

    @GetMapping("/documents")
    @Operation(summary = "Get current builder documents")
    public ResponseEntity<ApiResponse<List<ProviderDocumentDto>>> getMyDocuments() {
        List<ProviderDocumentDto> response = builderService.getMyDocuments();
        return ResponseEntity.ok(ApiResponse.success("Documents fetched", response));
    }

    @PostMapping(value = "/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload builder verification document (e.g. RERA certificate, GST, ID proof)")
    public ResponseEntity<ApiResponse<ProviderDocumentDto>> uploadDocument(
            @RequestParam(value = "documentType", defaultValue = "OTHER") String documentType,
            @RequestParam("file") MultipartFile file
    ) {
        ProviderDocumentDto response = builderService.uploadProviderDocument(documentType, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Document uploaded successfully", response));
    }

    @DeleteMapping("/documents/{id}")
    @Operation(summary = "Delete builder verification document")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable Long id) {
        builderService.deleteProviderDocument(id);
        return ResponseEntity.ok(ApiResponse.ok("Document deleted successfully"));
    }
}
