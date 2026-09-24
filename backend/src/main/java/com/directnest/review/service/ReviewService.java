package com.directnest.review.service;

import com.directnest.auth.service.AuthService;
import com.directnest.builder.entity.ProviderProfile;
import com.directnest.builder.repository.ProviderProfileRepository;
import com.directnest.common.dto.PagedResponse;
import com.directnest.exception.BadRequestException;
import com.directnest.exception.ForbiddenException;
import com.directnest.exception.ResourceNotFoundException;
import com.directnest.property.entity.Property;
import com.directnest.property.repository.PropertyRepository;
import com.directnest.review.dto.CreateReviewRequest;
import com.directnest.review.dto.ReviewResponse;
import com.directnest.review.entity.Review;
import com.directnest.review.repository.ReviewRepository;
import com.directnest.user.dto.UserResponse;
import com.directnest.user.entity.Role;
import com.directnest.user.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private static final Logger log = LoggerFactory.getLogger(ReviewService.class);

    private final ReviewRepository reviewRepository;
    private final PropertyRepository propertyRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final AuthService authService;

    public ReviewService(ReviewRepository reviewRepository,
                         PropertyRepository propertyRepository,
                         ProviderProfileRepository providerProfileRepository,
                         AuthService authService) {
        this.reviewRepository = reviewRepository;
        this.propertyRepository = propertyRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.authService = authService;
    }

    @Transactional
    public ReviewResponse createReview(CreateReviewRequest request) {
        User user = authService.getCurrentAuthenticatedUser();

        if (request.getPropertyId() == null && request.getProviderId() == null) {
            throw new BadRequestException("Either propertyId or providerId must be provided");
        }

        Review review = new Review();
        review.setUser(user);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        if (request.getPropertyId() != null) {
            Property property = propertyRepository.findById(request.getPropertyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Property", "id", request.getPropertyId()));
            review.setProperty(property);
        }

        if (request.getProviderId() != null) {
            ProviderProfile provider = providerProfileRepository.findById(request.getProviderId())
                    .orElseThrow(() -> new ResourceNotFoundException("ProviderProfile", "id", request.getProviderId()));
            review.setProvider(provider);
        }

        review = reviewRepository.save(review);
        log.info("Review {} created by user {}", review.getId(), user.getId());

        return mapToResponse(review);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ReviewResponse> getPropertyReviews(Long propertyId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Review> reviewPage = reviewRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId, pageRequest);

        List<ReviewResponse> content = reviewPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<ReviewResponse>builder()
                .content(content)
                .page(reviewPage.getNumber())
                .size(reviewPage.getSize())
                .totalElements(reviewPage.getTotalElements())
                .totalPages(reviewPage.getTotalPages())
                .last(reviewPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public PagedResponse<ReviewResponse> getProviderReviews(Long providerId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Review> reviewPage = reviewRepository.findByProviderIdOrderByCreatedAtDesc(providerId, pageRequest);

        List<ReviewResponse> content = reviewPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<ReviewResponse>builder()
                .content(content)
                .page(reviewPage.getNumber())
                .size(reviewPage.getSize())
                .totalElements(reviewPage.getTotalElements())
                .totalPages(reviewPage.getTotalPages())
                .last(reviewPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public PagedResponse<ReviewResponse> getMyReviews(int page, int size) {
        User user = authService.getCurrentAuthenticatedUser();
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Review> reviewPage = reviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageRequest);

        List<ReviewResponse> content = reviewPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<ReviewResponse>builder()
                .content(content)
                .page(reviewPage.getNumber())
                .size(reviewPage.getSize())
                .totalElements(reviewPage.getTotalElements())
                .totalPages(reviewPage.getTotalPages())
                .last(reviewPage.isLast())
                .build();
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));

        if (!review.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new ForbiddenException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
        log.info("Review {} deleted by user {}", reviewId, currentUser.getId());
    }

    private ReviewResponse mapToResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt());

        if (review.getUser() != null) {
            UserResponse userResp = new UserResponse();
            userResp.setId(review.getUser().getId());
            userResp.setFullName(review.getUser().getFullName());
            userResp.setEmail(review.getUser().getEmail());
            response.setUser(userResp);
        }

        if (review.getProperty() != null) {
            response.setPropertyId(review.getProperty().getId());
            response.setPropertyTitle(review.getProperty().getTitle());
        }

        if (review.getProvider() != null) {
            response.setProviderId(review.getProvider().getId());
            response.setProviderCompanyName(review.getProvider().getCompanyName());
        }

        return response;
    }
}
