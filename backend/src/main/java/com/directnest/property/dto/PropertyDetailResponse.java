package com.directnest.property.dto;

import com.directnest.amenity.entity.Amenity;
import com.directnest.builder.dto.ProviderProfileResponse;
import com.directnest.property.entity.FurnishingStatus;
import com.directnest.property.entity.ListingType;
import com.directnest.property.entity.PropertyStatus;
import com.directnest.property.entity.PropertyType;
import com.directnest.user.dto.UserResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class PropertyDetailResponse {
    private Long id;
    private UserResponse owner;
    private ProviderProfileResponse provider;
    private String title;
    private String description;
    private PropertyType propertyType;
    private ListingType listingType;
    private BigDecimal price;
    private boolean priceNegotiable;
    private BigDecimal areaSqft;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer balconies;
    private Integer floorNumber;
    private Integer totalFloors;
    private FurnishingStatus furnishingStatus;
    private LocalDate possessionDate;
    private String addressLine;
    private String locality;
    private String city;
    private String state;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private PropertyStatus status;
    private String adminNotes;
    private String rejectionReason;
    private LocalDateTime verifiedAt;
    private boolean featured;
    private Long viewsCount;
    private Set<Amenity> amenities;
    private List<PropertyImageDto> images;
    private List<PropertyDocumentDto> documents;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PropertyDetailResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserResponse getOwner() { return owner; }
    public void setOwner(UserResponse owner) { this.owner = owner; }

    public ProviderProfileResponse getProvider() { return provider; }
    public void setProvider(ProviderProfileResponse provider) { this.provider = provider; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

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

    public Integer getBalconies() { return balconies; }
    public void setBalconies(Integer balconies) { this.balconies = balconies; }

    public Integer getFloorNumber() { return floorNumber; }
    public void setFloorNumber(Integer floorNumber) { this.floorNumber = floorNumber; }

    public Integer getTotalFloors() { return totalFloors; }
    public void setTotalFloors(Integer totalFloors) { this.totalFloors = totalFloors; }

    public FurnishingStatus getFurnishingStatus() { return furnishingStatus; }
    public void setFurnishingStatus(FurnishingStatus furnishingStatus) { this.furnishingStatus = furnishingStatus; }

    public LocalDate getPossessionDate() { return possessionDate; }
    public void setPossessionDate(LocalDate possessionDate) { this.possessionDate = possessionDate; }

    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public PropertyStatus getStatus() { return status; }
    public void setStatus(PropertyStatus status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public Long getViewsCount() { return viewsCount; }
    public void setViewsCount(Long viewsCount) { this.viewsCount = viewsCount; }

    public Set<Amenity> getAmenities() { return amenities; }
    public void setAmenities(Set<Amenity> amenities) { this.amenities = amenities; }

    public List<PropertyImageDto> getImages() { return images; }
    public void setImages(List<PropertyImageDto> images) { this.images = images; }

    public List<PropertyDocumentDto> getDocuments() { return documents; }
    public void setDocuments(List<PropertyDocumentDto> documents) { this.documents = documents; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
