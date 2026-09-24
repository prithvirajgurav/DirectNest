package com.directnest.enquiry.controller;

import com.directnest.common.dto.ApiResponse;
import com.directnest.common.dto.PagedResponse;
import com.directnest.enquiry.dto.EnquiryResponse;
import com.directnest.enquiry.dto.RespondEnquiryRequest;
import com.directnest.enquiry.entity.EnquiryStatus;
import com.directnest.enquiry.service.EnquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/builder/enquiries")
@Tag(name = "Builder Enquiries", description = "Endpoints for builders to view and respond to enquiries")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('BUILDER', 'ADMIN')")
public class BuilderEnquiryController {

    private final EnquiryService enquiryService;

    public BuilderEnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @GetMapping
    @Operation(summary = "Get enquiries received for builder's properties")
    public ResponseEntity<ApiResponse<PagedResponse<EnquiryResponse>>> getBuilderEnquiries(
            @RequestParam(required = false) EnquiryStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<EnquiryResponse> response = enquiryService.getBuilderEnquiries(status, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}/respond")
    @Operation(summary = "Respond to an enquiry")
    public ResponseEntity<ApiResponse<EnquiryResponse>> respondToEnquiry(
            @PathVariable Long id,
            @Valid @RequestBody RespondEnquiryRequest request
    ) {
        EnquiryResponse response = enquiryService.respondToEnquiry(id, request);
        return ResponseEntity.ok(ApiResponse.success("Response sent successfully", response));
    }
}
