package com.directnest.property.specification;

import com.directnest.amenity.entity.Amenity;
import com.directnest.builder.entity.ProviderProfile;
import com.directnest.property.dto.PropertySearchFilter;
import com.directnest.property.entity.Property;
import com.directnest.property.entity.PropertyStatus;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class PropertySpecification {

    public static Specification<Property> withFilters(PropertySearchFilter filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Status filter: defaults to APPROVED if not specified
            if (filter.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.getStatus()));
            } else {
                predicates.add(criteriaBuilder.equal(root.get("status"), PropertyStatus.APPROVED));
            }

            // Text search on title, description, locality, city
            if (StringUtils.hasText(filter.getQuery())) {
                String searchPattern = "%" + filter.getQuery().toLowerCase().trim() + "%";
                Predicate titleMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchPattern);
                Predicate descMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern);
                Predicate localityMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("locality")), searchPattern);
                Predicate cityMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("city")), searchPattern);
                predicates.add(criteriaBuilder.or(titleMatch, descMatch, localityMatch, cityMatch));
            }

            // City filter (case-insensitive substring match)
            if (StringUtils.hasText(filter.getCity())) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("city")),
                        "%" + filter.getCity().toLowerCase().trim() + "%"
                ));
            }

            // Locality filter (case-insensitive substring match)
            if (StringUtils.hasText(filter.getLocality())) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("locality")),
                        "%" + filter.getLocality().toLowerCase().trim() + "%"
                ));
            }

            // Property type
            if (filter.getPropertyType() != null) {
                predicates.add(criteriaBuilder.equal(root.get("propertyType"), filter.getPropertyType()));
            }

            // Listing type
            if (filter.getListingType() != null) {
                predicates.add(criteriaBuilder.equal(root.get("listingType"), filter.getListingType()));
            }

            // Price range
            if (filter.getMinPrice() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()));
            }
            if (filter.getMaxPrice() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), filter.getMaxPrice()));
            }

            // Bedrooms
            if (filter.getBedrooms() != null) {
                if (filter.getBedrooms() >= 4) {
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("bedrooms"), 4));
                } else {
                    predicates.add(criteriaBuilder.equal(root.get("bedrooms"), filter.getBedrooms()));
                }
            }

            // Bathrooms
            if (filter.getBathrooms() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("bathrooms"), filter.getBathrooms()));
            }

            // Furnishing status
            if (filter.getFurnishingStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("furnishingStatus"), filter.getFurnishingStatus()));
            }

            // Featured
            if (filter.getFeatured() != null) {
                predicates.add(criteriaBuilder.equal(root.get("featured"), filter.getFeatured()));
            }

            // Provider type (BUILDER vs OWNER)
            if (filter.getProviderType() != null) {
                Subquery<Long> providerSubquery = query.subquery(Long.class);
                Root<ProviderProfile> profileRoot = providerSubquery.from(ProviderProfile.class);
                providerSubquery.select(profileRoot.get("user").get("id"))
                        .where(criteriaBuilder.equal(profileRoot.get("providerType"), filter.getProviderType()));
                predicates.add(root.get("user").get("id").in(providerSubquery));
            }

            // Amenities filter: ALL selected amenities semantics
            if (!CollectionUtils.isEmpty(filter.getAmenityIds())) {
                query.distinct(true);
                for (Long amenityId : filter.getAmenityIds()) {
                    if (amenityId == null) continue;
                    Subquery<Long> subquery = query.subquery(Long.class);
                    Root<Property> subRoot = subquery.correlate(root);
                    Join<Property, Amenity> amenityJoin = subRoot.join("amenities");
                    subquery.select(subRoot.get("id"))
                            .where(criteriaBuilder.equal(amenityJoin.get("id"), amenityId));
                    predicates.add(criteriaBuilder.exists(subquery));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
