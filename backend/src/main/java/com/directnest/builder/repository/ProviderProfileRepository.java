package com.directnest.builder.repository;

import com.directnest.builder.entity.ProviderProfile;
import com.directnest.builder.entity.ProviderType;
import com.directnest.builder.entity.VerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {

    Optional<ProviderProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    Page<ProviderProfile> findByVerificationStatus(VerificationStatus status, Pageable pageable);

    @Query("SELECT p FROM ProviderProfile p WHERE " +
           "(:status IS NULL OR p.verificationStatus = :status) AND " +
           "(:type IS NULL OR p.providerType = :type) AND " +
           "(:city IS NULL OR LOWER(p.companyCity) = LOWER(:city))")
    Page<ProviderProfile> searchProviders(
            @Param("status") VerificationStatus status,
            @Param("type") ProviderType type,
            @Param("city") String city,
            Pageable pageable
    );

    long countByVerificationStatus(VerificationStatus status);
}
