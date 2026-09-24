package com.directnest.sitevisit.controller;

import com.directnest.common.dto.ApiResponse;
import com.directnest.common.dto.PagedResponse;
import com.directnest.sitevisit.dto.CreateSiteVisitRequest;
import com.directnest.sitevisit.dto.SiteVisitResponse;
import com.directnest.sitevisit.service.SiteVisitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/site-visits")
@Tag(name = "Customer Site Visits", description = "Endpoints for customers to schedule and view site visits")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
public class CustomerSiteVisitController {

    private final SiteVisitService siteVisitService;

    public CustomerSiteVisitController(SiteVisitService siteVisitService) {
        this.siteVisitService = siteVisitService;
    }

    @PostMapping
    @Operation(summary = "Schedule a site visit")
    public ResponseEntity<ApiResponse<SiteVisitResponse>> requestSiteVisit(@Valid @RequestBody CreateSiteVisitRequest request) {
        SiteVisitResponse response = siteVisitService.requestSiteVisit(request);
        return ResponseEntity.ok(ApiResponse.success("Site visit requested successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get current customer's site visits")
    public ResponseEntity<ApiResponse<PagedResponse<SiteVisitResponse>>> getMySiteVisits(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<SiteVisitResponse> response = siteVisitService.getCustomerSiteVisits(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel a scheduled site visit")
    public ResponseEntity<ApiResponse<SiteVisitResponse>> cancelSiteVisit(@PathVariable Long id) {
        SiteVisitResponse response = siteVisitService.cancelSiteVisit(id);
        return ResponseEntity.ok(ApiResponse.success("Site visit cancelled", response));
    }
}
