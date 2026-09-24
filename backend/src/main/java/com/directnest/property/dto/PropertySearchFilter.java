package com.directnest.property.dto;

import com.directnest.builder.entity.ProviderType;
import com.directnest.property.entity.FurnishingStatus;
import com.directnest.property.entity.ListingType;
import com.directnest.property.entity.PropertyStatus;
import com.directnest.property.entity.PropertyType;

import java.math.BigDecimal;
import java.util.List;

public class PropertySearchFilter {
    private String query;
    private String city;
    private String locality;
    private PropertyType propertyType;
    private ListingType listingType;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Integer bedrooms;
    private Integer bathrooms;
    private FurnishingStatus furnishingStatus;
    private Boolean featured;
    private List<Long> amenityIds;
    private ProviderType providerType;
    private PropertyStatus status;

    public PropertySearchFilter() {}

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }

    public ListingType getListingType() { return listingType; }
    public void setListingType(ListingType listingType) { this.listingType = listingType; }

    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }

    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }

    public Integer getBathrooms() { return bathrooms; }
    public void setBathrooms(Integer bathrooms) { this.bathrooms = bathrooms; }

    public FurnishingStatus getFurnishingStatus() { return furnishingStatus; }
    public void setFurnishingStatus(FurnishingStatus furnishingStatus) { this.furnishingStatus = furnishingStatus; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public List<Long> getAmenityIds() { return amenityIds; }
    public void setAmenityIds(List<Long> amenityIds) { this.amenityIds = amenityIds; }

    public ProviderType getProviderType() { return providerType; }
    public void setProviderType(ProviderType providerType) { this.providerType = providerType; }

    public PropertyStatus getStatus() { return status; }
    public void setStatus(PropertyStatus status) { this.status = status; }
}
