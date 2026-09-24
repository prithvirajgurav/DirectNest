package com.directnest.builder.controller;

import com.directnest.builder.dto.ProviderProfileResponse;
import com.directnest.builder.entity.ProviderType;
import com.directnest.builder.entity.VerificationStatus;
import com.directnest.builder.service.BuilderService;
import com.directnest.common.dto.ApiResponse;
import com.directnest.common.dto.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/providers")
@Tag(name = "Public Providers", description = "Public directory of verified builders and property owners")
public class ProviderPublicController {

    private final BuilderService builderService;

    public ProviderPublicController(BuilderService builderService) {
        this.builderService = builderService;
    }

    @GetMapping
    @Operation(summary = "List verified builders and property owners")
    public ResponseEntity<ApiResponse<PagedResponse<ProviderProfileResponse>>> listProviders(
            @RequestParam(required = false) ProviderType type,
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        PagedResponse<ProviderProfileResponse> response = builderService.searchProviders(
                VerificationStatus.APPROVED, type, city, page, size
        );
        return ResponseEntity.ok(ApiResponse.success("Providers fetched successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get provider profile details by ID")
    public ResponseEntity<ApiResponse<ProviderProfileResponse>> getProviderById(@PathVariable Long id) {
        ProviderProfileResponse response = builderService.getProviderProfileById(id);
        return ResponseEntity.ok(ApiResponse.success("Provider details fetched", response));
    }
}
