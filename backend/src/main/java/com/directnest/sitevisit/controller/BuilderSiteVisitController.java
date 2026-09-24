package com.directnest.sitevisit.controller;

import com.directnest.common.dto.ApiResponse;
import com.directnest.common.dto.PagedResponse;
import com.directnest.sitevisit.dto.SiteVisitResponse;
import com.directnest.sitevisit.dto.UpdateSiteVisitStatusRequest;
import com.directnest.sitevisit.entity.SiteVisitStatus;
import com.directnest.sitevisit.service.SiteVisitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/builder/site-visits")
@Tag(name = "Builder Site Visits", description = "Endpoints for builders to manage site visit bookings")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('BUILDER', 'ADMIN')")
public class BuilderSiteVisitController {

    private final SiteVisitService siteVisitService;

    public BuilderSiteVisitController(SiteVisitService siteVisitService) {
        this.siteVisitService = siteVisitService;
    }

    @GetMapping
    @Operation(summary = "Get site visit requests for builder properties")
    public ResponseEntity<ApiResponse<PagedResponse<SiteVisitResponse>>> getBuilderSiteVisits(
            @RequestParam(required = false) SiteVisitStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<SiteVisitResponse> response = siteVisitService.getBuilderSiteVisits(status, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update site visit status (Confirm, Complete, Reject)")
    public ResponseEntity<ApiResponse<SiteVisitResponse>> updateSiteVisitStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSiteVisitStatusRequest request
    ) {
        SiteVisitResponse response = siteVisitService.updateSiteVisitStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Site visit updated successfully", response));
    }
}
