package com.directnest.property.entity;

import com.directnest.amenity.entity.Amenity;
import com.directnest.common.entity.BaseEntity;
import com.directnest.user.entity.User;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "properties")
public class Property extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false)
    private PropertyType propertyType;

    @Enumerated(EnumType.STRING)
    @Column(name = "listing_type", nullable = false)
    private ListingType listingType;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "price_negotiable", nullable = false)
    private boolean priceNegotiable = false;

    @Column(name = "area_sqft", nullable = false, precision = 10, scale = 2)
    private BigDecimal areaSqft;

    private Integer bedrooms;
    private Integer bathrooms;
    private Integer balconies;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Column(name = "total_floors")
    private Integer totalFloors;

    @Enumerated(EnumType.STRING)
    @Column(name = "furnishing_status")
    private FurnishingStatus furnishingStatus;

    @Column(name = "possession_date")
    private LocalDate possessionDate;

    @Column(name = "address_line")
    private String addressLine;

    private String locality;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String pincode;

    private Double latitude;
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyStatus status = PropertyStatus.DRAFT;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "is_featured", nullable = false)
    private boolean featured = false;

    @Column(name = "views_count", nullable = false)
    private Long viewsCount = 0L;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "property_amenities",
            joinColumns = @JoinColumn(name = "property_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private Set<Amenity> amenities = new HashSet<>();

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    private List<PropertyImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PropertyDocument> documents = new ArrayList<>();

    public Property() {}

    public Property(User user, String title, String description, PropertyType propertyType,
                    ListingType listingType, BigDecimal price, boolean priceNegotiable,
                    BigDecimal areaSqft, Integer bedrooms, Integer bathrooms, Integer balconies,
                    Integer floorNumber, Integer totalFloors, FurnishingStatus furnishingStatus,
                    LocalDate possessionDate, String addressLine, String locality,
                    String city, String state, String pincode, Double latitude, Double longitude,
                    PropertyStatus status, String adminNotes, String rejectionReason,
                    LocalDateTime verifiedAt, boolean featured, Long viewsCount) {
        this.user = user;
        this.title = title;
        this.description = description;
        this.propertyType = propertyType;
        this.listingType = listingType;
        this.price = price;
        this.priceNegotiable = priceNegotiable;
        this.areaSqft = areaSqft;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.balconies = balconies;
        this.floorNumber = floorNumber;
        this.totalFloors = totalFloors;
        this.furnishingStatus = furnishingStatus;
        this.possessionDate = possessionDate;
        this.addressLine = addressLine;
        this.locality = locality;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.adminNotes = adminNotes;
        this.rejectionReason = rejectionReason;
        this.verifiedAt = verifiedAt;
        this.featured = featured;
        this.viewsCount = viewsCount;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private User user;
        private String title;
        private String description;
        private PropertyType propertyType;
        private ListingType listingType;
        private BigDecimal price;
        private boolean priceNegotiable = false;
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
        private PropertyStatus status = PropertyStatus.DRAFT;
        private String adminNotes;
        private String rejectionReason;
        private LocalDateTime verifiedAt;
        private boolean featured = false;
        private Long viewsCount = 0L;
        private Set<Amenity> amenities = new HashSet<>();
        private List<PropertyImage> images = new ArrayList<>();
        private List<PropertyDocument> documents = new ArrayList<>();

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder user(User user) {
            this.user = user;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder propertyType(PropertyType propertyType) {
            this.propertyType = propertyType;
            return this;
        }

        public Builder listingType(ListingType listingType) {
            this.listingType = listingType;
            return this;
        }

        public Builder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public Builder priceNegotiable(boolean priceNegotiable) {
            this.priceNegotiable = priceNegotiable;
            return this;
        }

        public Builder areaSqft(BigDecimal areaSqft) {
            this.areaSqft = areaSqft;
            return this;
        }

        public Builder bedrooms(Integer bedrooms) {
            this.bedrooms = bedrooms;
            return this;
        }

        public Builder bathrooms(Integer bathrooms) {
            this.bathrooms = bathrooms;
            return this;
        }

        public Builder balconies(Integer balconies) {
            this.balconies = balconies;
            return this;
        }

        public Builder floorNumber(Integer floorNumber) {
            this.floorNumber = floorNumber;
            return this;
        }

        public Builder totalFloors(Integer totalFloors) {
            this.totalFloors = totalFloors;
            return this;
        }

        public Builder furnishingStatus(FurnishingStatus furnishingStatus) {
            this.furnishingStatus = furnishingStatus;
            return this;
        }

        public Builder possessionDate(LocalDate possessionDate) {
            this.possessionDate = possessionDate;
            return this;
        }

        public Builder addressLine(String addressLine) {
            this.addressLine = addressLine;
            return this;
        }

        public Builder locality(String locality) {
            this.locality = locality;
            return this;
        }

        public Builder city(String city) {
            this.city = city;
            return this;
        }

        public Builder state(String state) {
            this.state = state;
            return this;
        }

        public Builder pincode(String pincode) {
            this.pincode = pincode;
            return this;
        }

        public Builder latitude(Double latitude) {
            this.latitude = latitude;
            return this;
        }

        public Builder longitude(Double longitude) {
            this.longitude = longitude;
            return this;
        }

        public Builder status(PropertyStatus status) {
            this.status = status;
            return this;
        }

        public Builder adminNotes(String adminNotes) {
            this.adminNotes = adminNotes;
            return this;
        }

        public Builder rejectionReason(String rejectionReason) {
            this.rejectionReason = rejectionReason;
            return this;
        }

        public Builder verifiedAt(LocalDateTime verifiedAt) {
            this.verifiedAt = verifiedAt;
            return this;
        }

        public Builder featured(boolean featured) {
            this.featured = featured;
            return this;
        }

        public Builder viewsCount(Long viewsCount) {
            this.viewsCount = viewsCount;
            return this;
        }

        public Builder amenities(Set<Amenity> amenities) {
            this.amenities = amenities;
            return this;
        }

        public Builder images(List<PropertyImage> images) {
            this.images = images;
            return this;
        }

        public Builder documents(List<PropertyDocument> documents) {
            this.documents = documents;
            return this;
        }

        public Property build() {
            Property property = new Property(user, title, description, propertyType, listingType,
                    price, priceNegotiable, areaSqft, bedrooms, bathrooms, balconies, floorNumber,
                    totalFloors, furnishingStatus, possessionDate, addressLine, locality,
                    city, state, pincode, latitude, longitude, status, adminNotes,
                    rejectionReason, verifiedAt, featured, viewsCount);
            if (id != null) {
                property.setId(id);
            }
            if (amenities != null) {
                property.setAmenities(amenities);
            }
            if (images != null) {
                property.setImages(images);
            }
            if (documents != null) {
                property.setDocuments(documents);
            }
            return property;
        }
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public PropertyType getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(PropertyType propertyType) {
        this.propertyType = propertyType;
    }

    public ListingType getListingType() {
        return listingType;
    }

    public void setListingType(ListingType listingType) {
        this.listingType = listingType;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public boolean isPriceNegotiable() {
        return priceNegotiable;
    }

    public void setPriceNegotiable(boolean priceNegotiable) {
        this.priceNegotiable = priceNegotiable;
    }

    public BigDecimal getAreaSqft() {
        return areaSqft;
    }

    public void setAreaSqft(BigDecimal areaSqft) {
        this.areaSqft = areaSqft;
    }

    public Integer getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(Integer bedrooms) {
        this.bedrooms = bedrooms;
    }

    public Integer getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(Integer bathrooms) {
        this.bathrooms = bathrooms;
    }

    public Integer getBalconies() {
        return balconies;
    }

    public void setBalconies(Integer balconies) {
        this.balconies = balconies;
    }

    public Integer getFloorNumber() {
        return floorNumber;
    }

    public void setFloorNumber(Integer floorNumber) {
        this.floorNumber = floorNumber;
    }

    public Integer getTotalFloors() {
        return totalFloors;
    }

    public void setTotalFloors(Integer totalFloors) {
        this.totalFloors = totalFloors;
    }

    public FurnishingStatus getFurnishingStatus() {
        return furnishingStatus;
    }

    public void setFurnishingStatus(FurnishingStatus furnishingStatus) {
        this.furnishingStatus = furnishingStatus;
    }

    public LocalDate getPossessionDate() {
        return possessionDate;
    }

    public void setPossessionDate(LocalDate possessionDate) {
        this.possessionDate = possessionDate;
    }

    public String getAddressLine() {
        return addressLine;
    }

    public void setAddressLine(String addressLine) {
        this.addressLine = addressLine;
    }

    public String getLocality() {
        return locality;
    }

    public void setLocality(String locality) {
        this.locality = locality;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public PropertyStatus getStatus() {
        return status;
    }

    public void setStatus(PropertyStatus status) {
        this.status = status;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public Long getViewsCount() {
        return viewsCount;
    }

    public void setViewsCount(Long viewsCount) {
        this.viewsCount = viewsCount;
    }

    public Set<Amenity> getAmenities() {
        return amenities;
    }

    public void setAmenities(Set<Amenity> amenities) {
        this.amenities = amenities;
    }

    public List<PropertyImage> getImages() {
        return images;
    }

    public void setImages(List<PropertyImage> images) {
        this.images = images;
    }

    public List<PropertyDocument> getDocuments() {
        return documents;
    }

    public void setDocuments(List<PropertyDocument> documents) {
        this.documents = documents;
    }
}
