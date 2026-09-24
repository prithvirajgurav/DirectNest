package com.directnest.enquiry.repository;

import com.directnest.enquiry.entity.Enquiry;
import com.directnest.enquiry.entity.EnquiryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

    Page<Enquiry> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);

    @Query("SELECT e FROM Enquiry e WHERE e.property.user.id = :builderId ORDER BY e.createdAt DESC")
    Page<Enquiry> findByBuilderId(@Param("builderId") Long builderId, Pageable pageable);

    @Query("SELECT e FROM Enquiry e WHERE e.property.user.id = :builderId AND e.status = :status ORDER BY e.createdAt DESC")
    Page<Enquiry> findByBuilderIdAndStatus(@Param("builderId") Long builderId, @Param("status") EnquiryStatus status, Pageable pageable);

    long countByPropertyUserIdAndStatus(Long builderId, EnquiryStatus status);
}
