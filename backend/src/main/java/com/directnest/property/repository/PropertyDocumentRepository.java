package com.directnest.property.repository;

import com.directnest.property.entity.PropertyDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyDocumentRepository extends JpaRepository<PropertyDocument, Long> {

    List<PropertyDocument> findByPropertyId(Long propertyId);

    void deleteByPropertyId(Long propertyId);
}
