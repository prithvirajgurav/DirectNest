package com.directnest.builder.repository;

import com.directnest.builder.entity.ProviderDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProviderDocumentRepository extends JpaRepository<ProviderDocument, Long> {

    List<ProviderDocument> findByProviderProfileId(Long providerProfileId);

    void deleteByProviderProfileId(Long providerProfileId);
}
