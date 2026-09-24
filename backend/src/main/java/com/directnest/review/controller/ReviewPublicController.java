package com.directnest.review.controller;

import com.directnest.common.dto.ApiResponse;
import com.directnest.common.dto.PagedResponse;
import com.directnest.review.dto.ReviewResponse;
import com.directnest.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Reviews (Public)", description = "Public endpoints for reading property and provider reviews")
public class ReviewPublicController {

    private final ReviewService reviewService;

    public ReviewPublicController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/api/properties/{propertyId}/reviews")
    @Operation(summary = "Get reviews for a property")
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getPropertyReviews(
            @PathVariable Long propertyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<ReviewResponse> response = reviewService.getPropertyReviews(propertyId, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/api/providers/{providerId}/reviews")
    @Operation(summary = "Get reviews for a provider")
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getProviderReviews(
            @PathVariable Long providerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<ReviewResponse> response = reviewService.getProviderReviews(providerId, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
