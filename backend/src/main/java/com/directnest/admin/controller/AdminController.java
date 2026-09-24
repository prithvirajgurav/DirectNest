package com.directnest.admin.controller;

import com.directnest.admin.dto.AdminDashboardStatsResponse;
import com.directnest.admin.service.AdminService;
import com.directnest.builder.dto.ProviderProfileResponse;
import com.directnest.builder.entity.VerificationStatus;
import com.directnest.common.dto.ApiResponse;
import com.directnest.common.dto.PagedResponse;
import com.directnest.property.dto.PropertyDetailResponse;
import com.directnest.property.dto.PropertyListResponse;
import com.directnest.property.entity.PropertyStatus;
import com.directnest.user.dto.UserResponse;
import com.directnest.user.entity.Role;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Management", description = "Endpoints for platform administration")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get platform overview metrics and statistics")
    public ResponseEntity<ApiResponse<AdminDashboardStatsResponse>> getDashboardStats() {
        AdminDashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard statistics fetched", stats));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all registered users")
    public ResponseEntity<ApiResponse<PagedResponse<UserResponse>>> getUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<UserResponse> response = adminService.getUsers(role, page, size);
        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", response));
    }

    @PutMapping("/users/{id}/suspend")
    @Operation(summary = "Suspend a user account")
    public ResponseEntity<ApiResponse<UserResponse>> suspendUser(@PathVariable Long id) {
        UserResponse response = adminService.suspendUser(id);
        return ResponseEntity.ok(ApiResponse.success("User account suspended", response));
    }

    @PutMapping("/users/{id}/activate")
    @Operation(summary = "Activate a user account")
    public ResponseEntity<ApiResponse<UserResponse>> activateUser(@PathVariable Long id) {
        UserResponse response = adminService.activateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User account activated", response));
    }

    @GetMapping("/providers")
    @Operation(summary = "Get provider profiles")
    public ResponseEntity<ApiResponse<PagedResponse<ProviderProfileResponse>>> getProviders(
            @RequestParam(required = false) VerificationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<ProviderProfileResponse> response = adminService.getProviders(status, page, size);
        return ResponseEntity.ok(ApiResponse.success("Providers fetched successfully", response));
    }

    @GetMapping("/verifications")
    @Operation(summary = "Get provider verification requests")
    public ResponseEntity<ApiResponse<PagedResponse<ProviderProfileResponse>>> getVerifications(
            @RequestParam(required = false) VerificationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<ProviderProfileResponse> response = adminService.getProviders(
                status != null ? status : VerificationStatus.PENDING_VERIFICATION, page, size);
        return ResponseEntity.ok(ApiResponse.success("Verification requests fetched successfully", response));
    }

    @PutMapping("/verifications/{id}/approve")
    @Operation(summary = "Approve provider verification")
    public ResponseEntity<ApiResponse<ProviderProfileResponse>> approveVerification(@PathVariable Long id) {
        ProviderProfileResponse response = adminService.approveProvider(id);
        return ResponseEntity.ok(ApiResponse.success("Provider verified successfully", response));
    }

    @PutMapping("/verifications/{id}/reject")
    @Operation(summary = "Reject provider verification")
    public ResponseEntity<ApiResponse<ProviderProfileResponse>> rejectVerification(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String reason = body != null ? body.get("reason") : "Requirements not met";
        ProviderProfileResponse response = adminService.rejectProvider(id, reason);
        return ResponseEntity.ok(ApiResponse.success("Provider verification rejected", response));
    }

    @GetMapping("/properties")
    @Operation(summary = "Get all properties with optional status filter")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyListResponse>>> getProperties(
            @RequestParam(required = false) PropertyStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<PropertyListResponse> response = adminService.getProperties(status, page, size);
        return ResponseEntity.ok(ApiResponse.success("Properties fetched successfully", response));
    }

    @GetMapping("/properties/pending")
    @Operation(summary = "Get pending property submissions for review")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyListResponse>>> getPendingProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<PropertyListResponse> response = adminService.getPendingProperties(page, size);
        return ResponseEntity.ok(ApiResponse.success("Pending properties fetched successfully", response));
    }

    @GetMapping("/properties/{id}/review")
    @Operation(summary = "Get full property details for admin review")
    public ResponseEntity<ApiResponse<PropertyDetailResponse>> getPropertyForReview(@PathVariable Long id) {
        PropertyDetailResponse response = adminService.getPropertyForReview(id);
        return ResponseEntity.ok(ApiResponse.success("Property review details fetched successfully", response));
    }

    @PutMapping("/properties/{id}/approve")
    @Operation(summary = "Approve property listing for public search")
    public ResponseEntity<ApiResponse<PropertyDetailResponse>> approveProperty(@PathVariable Long id) {
        PropertyDetailResponse response = adminService.approveProperty(id);
        return ResponseEntity.ok(ApiResponse.success("Property approved and published", response));
    }

    @PutMapping("/properties/{id}/reject")
    @Operation(summary = "Reject property listing with feedback")
    public ResponseEntity<ApiResponse<PropertyDetailResponse>> rejectProperty(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String reason = "Requirements not met";
        if (body != null) {
            if (body.containsKey("reason") && body.get("reason") != null && !body.get("reason").isBlank()) {
                reason = body.get("reason");
            } else if (body.containsKey("rejectionReason") && body.get("rejectionReason") != null && !body.get("rejectionReason").isBlank()) {
                reason = body.get("rejectionReason");
            }
        }
        PropertyDetailResponse response = adminService.rejectProperty(id, reason);
        return ResponseEntity.ok(ApiResponse.success("Property rejected", response));
    }
}
