package com.directnest.enquiry.controller;

import com.directnest.common.dto.ApiResponse;
import com.directnest.common.dto.PagedResponse;
import com.directnest.enquiry.dto.CreateEnquiryRequest;
import com.directnest.enquiry.dto.EnquiryResponse;
import com.directnest.enquiry.service.EnquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/enquiries")
@Tag(name = "Customer Enquiries", description = "Endpoints for customers to send and view property enquiries")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
public class CustomerEnquiryController {

    private final EnquiryService enquiryService;

    public CustomerEnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @PostMapping
    @Operation(summary = "Submit a property enquiry")
    public ResponseEntity<ApiResponse<EnquiryResponse>> createEnquiry(@Valid @RequestBody CreateEnquiryRequest request) {
        EnquiryResponse response = enquiryService.createEnquiry(request);
        return ResponseEntity.ok(ApiResponse.success("Enquiry submitted successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get current customer's enquiries")
    public ResponseEntity<ApiResponse<PagedResponse<EnquiryResponse>>> getMyEnquiries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<EnquiryResponse> response = enquiryService.getCustomerEnquiries(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
