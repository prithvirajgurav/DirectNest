package com.directnest.builder.dto;

import com.directnest.builder.entity.ProviderType;
import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateProviderProfileRequest {

    @NotNull(message = "Provider type is required (BUILDER or OWNER)")
    private ProviderType providerType = ProviderType.BUILDER;

    @NotBlank(message = "Company/Name is required")
    private String companyName;

    private String companyDescription;
    private String companyAddress;
    private String companyCity = "Bangalore";
    private String companyState = "Karnataka";
    private String companyPincode = "560001";
    private String gstin;
    private Integer yearsOfExperience;
    private String websiteUrl;

    public CreateProviderProfileRequest() {}

    public CreateProviderProfileRequest(ProviderType providerType, String companyName, String companyDescription,
                                        String companyAddress, String companyCity, String companyState,
                                        String companyPincode, String gstin, Integer yearsOfExperience, String websiteUrl) {
        this.providerType = providerType;
        this.companyName = companyName;
        this.companyDescription = companyDescription;
        this.companyAddress = companyAddress;
        this.companyCity = companyCity;
        this.companyState = companyState;
        this.companyPincode = companyPincode;
        this.gstin = gstin;
        this.yearsOfExperience = yearsOfExperience;
        this.websiteUrl = websiteUrl;
    }

    public ProviderType getProviderType() {
        return providerType;
    }

    public void setProviderType(ProviderType providerType) {
        this.providerType = providerType;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    @JsonSetter("businessName")
    public void setBusinessName(String businessName) {
        if (businessName != null && !businessName.trim().isEmpty()) {
            this.companyName = businessName;
        }
    }

    public String getCompanyDescription() {
        return companyDescription;
    }

    public void setCompanyDescription(String companyDescription) {
        this.companyDescription = companyDescription;
    }

    @JsonSetter("description")
    public void setDescription(String description) {
        this.companyDescription = description;
    }

    public String getCompanyAddress() {
        return companyAddress;
    }

    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
    }

    @JsonSetter("address")
    public void setAddress(String address) {
        this.companyAddress = address;
    }

    public String getCompanyCity() {
        return companyCity;
    }

    public void setCompanyCity(String companyCity) {
        if (companyCity != null && !companyCity.trim().isEmpty()) {
            this.companyCity = companyCity;
        }
    }

    @JsonSetter("city")
    public void setCity(String city) {
        if (city != null && !city.trim().isEmpty()) {
            this.companyCity = city;
        }
    }

    public String getCompanyState() {
        return companyState;
    }

    public void setCompanyState(String companyState) {
        if (companyState != null && !companyState.trim().isEmpty()) {
            this.companyState = companyState;
        }
    }

    @JsonSetter("state")
    public void setState(String state) {
        if (state != null && !state.trim().isEmpty()) {
            this.companyState = state;
        }
    }

    public String getCompanyPincode() {
        return companyPincode;
    }

    public void setCompanyPincode(String companyPincode) {
        if (companyPincode != null && !companyPincode.trim().isEmpty()) {
            this.companyPincode = companyPincode;
        }
    }

    @JsonSetter("pincode")
    public void setPincode(String pincode) {
        if (pincode != null && !pincode.trim().isEmpty()) {
            this.companyPincode = pincode;
        }
    }

    public String getGstin() {
        return gstin;
    }

    public void setGstin(String gstin) {
        this.gstin = gstin;
    }

    @JsonSetter("reraNumber")
    public void setReraNumber(String reraNumber) {
        this.gstin = reraNumber;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    @JsonSetter("experienceYears")
    public void setExperienceYears(Integer experienceYears) {
        this.yearsOfExperience = experienceYears;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }
}
