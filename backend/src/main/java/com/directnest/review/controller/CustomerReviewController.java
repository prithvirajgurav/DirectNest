package com.directnest.review.controller;

import com.directnest.common.dto.ApiResponse;
import com.directnest.common.dto.PagedResponse;
import com.directnest.review.dto.CreateReviewRequest;
import com.directnest.review.dto.ReviewResponse;
import com.directnest.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/reviews")
@Tag(name = "Customer Reviews", description = "Endpoints for customers to submit and manage reviews")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
public class CustomerReviewController {

    private final ReviewService reviewService;

    public CustomerReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @Operation(summary = "Submit a review for a property or provider")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(@Valid @RequestBody CreateReviewRequest request) {
        ReviewResponse response = reviewService.createReview(request);
        return ResponseEntity.ok(ApiResponse.success("Review submitted successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get current customer's reviews")
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getMyReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<ReviewResponse> response = reviewService.getMyReviews(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a review")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully", null));
    }
}
