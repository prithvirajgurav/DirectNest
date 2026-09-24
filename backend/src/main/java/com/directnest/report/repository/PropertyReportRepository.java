package com.directnest.report.repository;

import com.directnest.report.entity.PropertyReport;
import com.directnest.report.entity.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyReportRepository extends JpaRepository<PropertyReport, Long> {

    Page<PropertyReport> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<PropertyReport> findByStatusOrderByCreatedAtDesc(ReportStatus status, Pageable pageable);

    Page<PropertyReport> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByStatus(ReportStatus status);
}
