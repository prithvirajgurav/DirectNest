package com.directnest.property.controller;

import com.directnest.builder.entity.ProviderType;
import com.directnest.common.dto.ApiResponse;
import com.directnest.common.dto.PagedResponse;
import com.directnest.exception.ResourceNotFoundException;
import com.directnest.property.dto.PropertyDetailResponse;
import com.directnest.property.dto.PropertyListResponse;
import com.directnest.property.dto.PropertySearchFilter;
import com.directnest.property.entity.FurnishingStatus;
import com.directnest.property.entity.ListingType;
import com.directnest.property.entity.PropertyStatus;
import com.directnest.property.entity.PropertyType;
import com.directnest.property.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@Tag(name = "Public Properties", description = "Public property search, filtering, and detail view (Approved properties only)")
public class PropertyPublicController {

    private final PropertyService propertyService;

    public PropertyPublicController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    @Operation(summary = "Search and filter approved properties with pagination and sorting")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyListResponse>>> searchProperties(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String locality,
            @RequestParam(required = false) PropertyType propertyType,
            @RequestParam(required = false) ListingType listingType,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) Integer bathrooms,
            @RequestParam(required = false) FurnishingStatus furnishingStatus,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) List<Long> amenityIds,
            @RequestParam(required = false) ProviderType providerType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PropertySearchFilter filter = new PropertySearchFilter();
        filter.setQuery(query);
        filter.setCity(city);
        filter.setLocality(locality);
        filter.setPropertyType(propertyType);
        filter.setListingType(listingType);
        filter.setMinPrice(minPrice);
        filter.setMaxPrice(maxPrice);
        filter.setBedrooms(bedrooms);
        filter.setBathrooms(bathrooms);
        filter.setFurnishingStatus(furnishingStatus);
        filter.setFeatured(featured);
        filter.setAmenityIds(amenityIds);
        filter.setProviderType(providerType);
        filter.setStatus(PropertyStatus.APPROVED); // Strict security rule: Only approved listings for public search

        PagedResponse<PropertyListResponse> response = propertyService.searchProperties(filter, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Properties retrieved", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full property details by ID (Increments view count)")
    public ResponseEntity<ApiResponse<PropertyDetailResponse>> getPropertyById(@PathVariable Long id) {
        PropertyDetailResponse response = propertyService.getPropertyById(id);
        if (response.getStatus() != PropertyStatus.APPROVED) {
            throw new ResourceNotFoundException("Property", "id", id);
        }
        propertyService.incrementViews(id);
        return ResponseEntity.ok(ApiResponse.success("Property details retrieved", response));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured properties for homepage")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyListResponse>>> getFeaturedProperties() {
        PropertySearchFilter filter = new PropertySearchFilter();
        filter.setStatus(PropertyStatus.APPROVED);
        filter.setFeatured(true);

        PagedResponse<PropertyListResponse> response = propertyService.searchProperties(filter, 0, 6, "createdAt", "desc");
        return ResponseEntity.ok(ApiResponse.success("Featured properties retrieved", response));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recently added properties for homepage")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyListResponse>>> getRecentProperties() {
        PropertySearchFilter filter = new PropertySearchFilter();
        filter.setStatus(PropertyStatus.APPROVED);

        PagedResponse<PropertyListResponse> response = propertyService.searchProperties(filter, 0, 6, "createdAt", "desc");
        return ResponseEntity.ok(ApiResponse.success("Recent properties retrieved", response));
    }
}
