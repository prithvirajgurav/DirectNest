package com.directnest.property.repository;

import com.directnest.property.entity.Property;
import com.directnest.property.entity.PropertyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {

    Page<Property> findByUserId(Long userId, Pageable pageable);

    Page<Property> findByUserIdAndStatus(Long userId, PropertyStatus status, Pageable pageable);

    Page<Property> findByStatus(PropertyStatus status, Pageable pageable);

    Page<Property> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Optional<Property> findByIdAndUserId(Long id, Long userId);

    boolean existsByTitle(String title);

    Optional<Property> findByTitle(String title);

    @Query("SELECT p FROM Property p LEFT JOIN FETCH p.amenities WHERE p.id = :id")
    Optional<Property> findByIdWithAmenities(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Property p SET p.viewsCount = p.viewsCount + 1 WHERE p.id = :id")
    void incrementViewsCount(@Param("id") Long id);

    long countByStatus(PropertyStatus status);

    long countByUserId(Long userId);

    List<Property> findTop6ByStatusAndFeaturedTrueOrderByCreatedAtDesc(PropertyStatus status);

    List<Property> findTop6ByStatusOrderByCreatedAtDesc(PropertyStatus status);
}
