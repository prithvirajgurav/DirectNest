package com.directnest.property.dto;

import com.directnest.property.entity.FurnishingStatus;
import com.directnest.property.entity.ListingType;
import com.directnest.property.entity.PropertyType;
import com.fasterxml.jackson.annotation.JsonSetter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

public class UpdatePropertyRequest {

    private String title;
    private String description;
    private PropertyType propertyType;
    private ListingType listingType;
    private BigDecimal price;
    private Boolean priceNegotiable;
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
    private Set<Long> amenityIds;

    public UpdatePropertyRequest() {}

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

    public Boolean getPriceNegotiable() { return priceNegotiable; }
    public void setPriceNegotiable(Boolean priceNegotiable) { this.priceNegotiable = priceNegotiable; }

    public BigDecimal getAreaSqft() { return areaSqft; }
    public void setAreaSqft(BigDecimal areaSqft) { this.areaSqft = areaSqft; }

    @JsonSetter("builtUpArea")
    public void setBuiltUpArea(BigDecimal builtUpArea) {
        if (this.areaSqft == null && builtUpArea != null) {
            this.areaSqft = builtUpArea;
        }
    }

    @JsonSetter("carpetArea")
    public void setCarpetArea(BigDecimal carpetArea) {
        if (this.areaSqft == null && carpetArea != null) {
            this.areaSqft = carpetArea;
        }
    }

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

    @JsonSetter("furnishing")
    public void setFurnishing(FurnishingStatus furnishing) {
        if (this.furnishingStatus == null && furnishing != null) {
            this.furnishingStatus = furnishing;
        }
    }

    public LocalDate getPossessionDate() { return possessionDate; }
    public void setPossessionDate(LocalDate possessionDate) { this.possessionDate = possessionDate; }

    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }

    @JsonSetter("address")
    public void setAddress(String address) {
        if (this.addressLine == null && address != null) {
            this.addressLine = address;
        }
    }

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

    public Set<Long> getAmenityIds() { return amenityIds; }
    public void setAmenityIds(Set<Long> amenityIds) { this.amenityIds = amenityIds; }
}
