package com.directnest.property.repository;

import com.directnest.property.entity.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {

    List<PropertyImage> findByPropertyIdOrderByDisplayOrderAsc(Long propertyId);

    Optional<PropertyImage> findByPropertyIdAndPrimaryTrue(Long propertyId);

    @Modifying
    @Query("UPDATE PropertyImage pi SET pi.primary = false WHERE pi.property.id = :propertyId")
    void unsetPrimaryForProperty(@Param("propertyId") Long propertyId);

    void deleteByPropertyId(Long propertyId);
}
