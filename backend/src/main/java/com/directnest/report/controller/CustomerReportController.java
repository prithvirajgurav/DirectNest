package com.directnest.report.controller;

import com.directnest.common.dto.ApiResponse;
import com.directnest.common.dto.PagedResponse;
import com.directnest.report.dto.CreateReportRequest;
import com.directnest.report.dto.PropertyReportResponse;
import com.directnest.report.service.PropertyReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/reports")
@Tag(name = "Customer Reports", description = "Endpoints for customers to report suspicious listings")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
public class CustomerReportController {

    private final PropertyReportService propertyReportService;

    public CustomerReportController(PropertyReportService propertyReportService) {
        this.propertyReportService = propertyReportService;
    }

    @PostMapping
    @Operation(summary = "Report a property listing")
    public ResponseEntity<ApiResponse<PropertyReportResponse>> reportProperty(@Valid @RequestBody CreateReportRequest request) {
        PropertyReportResponse response = propertyReportService.reportProperty(request);
        return ResponseEntity.ok(ApiResponse.success("Report submitted successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get current user's submitted reports")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyReportResponse>>> getMyReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<PropertyReportResponse> response = propertyReportService.getMyReports(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
