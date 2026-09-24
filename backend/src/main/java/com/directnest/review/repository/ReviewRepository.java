package com.directnest.review.repository;

import com.directnest.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByPropertyIdOrderByCreatedAtDesc(Long propertyId, Pageable pageable);

    Page<Review> findByProviderIdOrderByCreatedAtDesc(Long providerId, Pageable pageable);

    Page<Review> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Optional<Review> findByUserIdAndPropertyId(Long userId, Long propertyId);

    Optional<Review> findByUserIdAndProviderId(Long userId, Long providerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.property.id = :propertyId")
    Double getAverageRatingForProperty(@Param("propertyId") Long propertyId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.provider.id = :providerId")
    Double getAverageRatingForProvider(@Param("providerId") Long providerId);

    long countByPropertyId(Long propertyId);

    long countByProviderId(Long providerId);
}
