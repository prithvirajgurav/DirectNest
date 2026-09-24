package com.directnest.sitevisit.repository;

import com.directnest.sitevisit.entity.SiteVisit;
import com.directnest.sitevisit.entity.SiteVisitStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SiteVisitRepository extends JpaRepository<SiteVisit, Long> {

    Page<SiteVisit> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);

    @Query("SELECT s FROM SiteVisit s WHERE s.property.user.id = :builderId ORDER BY s.createdAt DESC")
    Page<SiteVisit> findByBuilderId(@Param("builderId") Long builderId, Pageable pageable);

    @Query("SELECT s FROM SiteVisit s WHERE s.property.user.id = :builderId AND s.status = :status ORDER BY s.createdAt DESC")
    Page<SiteVisit> findByBuilderIdAndStatus(@Param("builderId") Long builderId, @Param("status") SiteVisitStatus status, Pageable pageable);

    long countByPropertyUserIdAndStatus(Long builderId, SiteVisitStatus status);
}
