package com.directnest.property.dto;

import com.directnest.property.entity.FurnishingStatus;
import com.directnest.property.entity.ListingType;
import com.directnest.property.entity.PropertyStatus;
import com.directnest.property.entity.PropertyType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PropertyListResponse {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private String ownerPhone;
    private String title;
    private PropertyType propertyType;
    private ListingType listingType;
    private BigDecimal price;
    private boolean priceNegotiable;
    private BigDecimal areaSqft;
    private Integer bedrooms;
    private Integer bathrooms;
    private FurnishingStatus furnishingStatus;
    private String locality;
    private String city;
    private String state;
    private String primaryImageUrl;
    private PropertyStatus status;
    private boolean featured;
    private Long viewsCount;
    private LocalDateTime createdAt;

    public PropertyListResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }

    public String getOwnerPhone() { return ownerPhone; }
    public void setOwnerPhone(String ownerPhone) { this.ownerPhone = ownerPhone; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }

    public ListingType getListingType() { return listingType; }
    public void setListingType(ListingType listingType) { this.listingType = listingType; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public boolean isPriceNegotiable() { return priceNegotiable; }
    public void setPriceNegotiable(boolean priceNegotiable) { this.priceNegotiable = priceNegotiable; }

    public BigDecimal getAreaSqft() { return areaSqft; }
    public void setAreaSqft(BigDecimal areaSqft) { this.areaSqft = areaSqft; }

    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }

    public Integer getBathrooms() { return bathrooms; }
    public void setBathrooms(Integer bathrooms) { this.bathrooms = bathrooms; }

    public FurnishingStatus getFurnishingStatus() { return furnishingStatus; }
    public void setFurnishingStatus(FurnishingStatus furnishingStatus) { this.furnishingStatus = furnishingStatus; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPrimaryImageUrl() { return primaryImageUrl; }
    public void setPrimaryImageUrl(String primaryImageUrl) { this.primaryImageUrl = primaryImageUrl; }

    public PropertyStatus getStatus() { return status; }
    public void setStatus(PropertyStatus status) { this.status = status; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public Long getViewsCount() { return viewsCount; }
    public void setViewsCount(Long viewsCount) { this.viewsCount = viewsCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
