package com.directnest.report.controller;

import com.directnest.common.dto.ApiResponse;
import com.directnest.common.dto.PagedResponse;
import com.directnest.report.dto.PropertyReportResponse;
import com.directnest.report.dto.UpdateReportStatusRequest;
import com.directnest.report.entity.ReportStatus;
import com.directnest.report.service.PropertyReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reports")
@Tag(name = "Admin Reports", description = "Endpoints for administrators to review reported listings")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminReportController {

    private final PropertyReportService propertyReportService;

    public AdminReportController(PropertyReportService propertyReportService) {
        this.propertyReportService = propertyReportService;
    }

    @GetMapping
    @Operation(summary = "Get all property reports")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyReportResponse>>> getAllReports(
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<PropertyReportResponse> response = propertyReportService.getAllReports(status, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update report status and admin notes")
    public ResponseEntity<ApiResponse<PropertyReportResponse>> updateReport(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReportStatusRequest request
    ) {
        PropertyReportResponse response = propertyReportService.updateReportStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Report updated successfully", response));
    }
}
