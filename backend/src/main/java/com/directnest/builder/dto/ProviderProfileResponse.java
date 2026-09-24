package com.directnest.builder.dto;

import com.directnest.builder.entity.ProviderType;
import com.directnest.builder.entity.VerificationStatus;
import com.directnest.user.dto.UserResponse;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

public class ProviderProfileResponse {
    private Long id;
    private UserResponse user;
    private ProviderType providerType;
    private String companyName;
    private String companyDescription;
    private String companyAddress;
    private String companyCity;
    private String companyState;
    private String companyPincode;
    private String gstin;
    private Integer yearsOfExperience;
    private String websiteUrl;
    private VerificationStatus verificationStatus;
    private String verificationNotes;
    private LocalDateTime verifiedAt;
    private List<ProviderDocumentDto> documents;
    private LocalDateTime createdAt;

    public ProviderProfileResponse() {}

    public ProviderProfileResponse(Long id, UserResponse user, ProviderType providerType, String companyName,
                                   String companyDescription, String companyAddress, String companyCity,
                                   String companyState, String companyPincode, String gstin,
                                   Integer yearsOfExperience, String websiteUrl,
                                   VerificationStatus verificationStatus, String verificationNotes,
                                   LocalDateTime verifiedAt, List<ProviderDocumentDto> documents,
                                   LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
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
        this.verificationStatus = verificationStatus;
        this.verificationNotes = verificationNotes;
        this.verifiedAt = verifiedAt;
        this.documents = documents;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private UserResponse user;
        private ProviderType providerType;
        private String companyName;
        private String companyDescription;
        private String companyAddress;
        private String companyCity;
        private String companyState;
        private String companyPincode;
        private String gstin;
        private Integer yearsOfExperience;
        private String websiteUrl;
        private VerificationStatus verificationStatus;
        private String verificationNotes;
        private LocalDateTime verifiedAt;
        private List<ProviderDocumentDto> documents;
        private LocalDateTime createdAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder user(UserResponse user) {
            this.user = user;
            return this;
        }

        public Builder providerType(ProviderType providerType) {
            this.providerType = providerType;
            return this;
        }

        public Builder companyName(String companyName) {
            this.companyName = companyName;
            return this;
        }

        public Builder companyDescription(String companyDescription) {
            this.companyDescription = companyDescription;
            return this;
        }

        public Builder companyAddress(String companyAddress) {
            this.companyAddress = companyAddress;
            return this;
        }

        public Builder companyCity(String companyCity) {
            this.companyCity = companyCity;
            return this;
        }

        public Builder companyState(String companyState) {
            this.companyState = companyState;
            return this;
        }

        public Builder companyPincode(String companyPincode) {
            this.companyPincode = companyPincode;
            return this;
        }

        public Builder gstin(String gstin) {
            this.gstin = gstin;
            return this;
        }

        public Builder yearsOfExperience(Integer yearsOfExperience) {
            this.yearsOfExperience = yearsOfExperience;
            return this;
        }

        public Builder websiteUrl(String websiteUrl) {
            this.websiteUrl = websiteUrl;
            return this;
        }

        public Builder verificationStatus(VerificationStatus verificationStatus) {
            this.verificationStatus = verificationStatus;
            return this;
        }

        public Builder verificationNotes(String verificationNotes) {
            this.verificationNotes = verificationNotes;
            return this;
        }

        public Builder verifiedAt(LocalDateTime verifiedAt) {
            this.verifiedAt = verifiedAt;
            return this;
        }

        public Builder documents(List<ProviderDocumentDto> documents) {
            this.documents = documents;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ProviderProfileResponse build() {
            return new ProviderProfileResponse(id, user, providerType, companyName, companyDescription,
                    companyAddress, companyCity, companyState, companyPincode, gstin, yearsOfExperience,
                    websiteUrl, verificationStatus, verificationNotes, verifiedAt, documents, createdAt);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
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

    @JsonProperty("businessName")
    public String getBusinessName() {
        return companyName;
    }

    public String getCompanyDescription() {
        return companyDescription;
    }

    public void setCompanyDescription(String companyDescription) {
        this.companyDescription = companyDescription;
    }

    @JsonProperty("description")
    public String getDescription() {
        return companyDescription;
    }

    public String getCompanyAddress() {
        return companyAddress;
    }

    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
    }

    @JsonProperty("address")
    public String getAddress() {
        return companyAddress;
    }

    public String getCompanyCity() {
        return companyCity;
    }

    public void setCompanyCity(String companyCity) {
        this.companyCity = companyCity;
    }

    @JsonProperty("city")
    public String getCity() {
        return companyCity;
    }

    public String getCompanyState() {
        return companyState;
    }

    public void setCompanyState(String companyState) {
        this.companyState = companyState;
    }

    @JsonProperty("state")
    public String getState() {
        return companyState;
    }

    public String getCompanyPincode() {
        return companyPincode;
    }

    public void setCompanyPincode(String companyPincode) {
        this.companyPincode = companyPincode;
    }

    @JsonProperty("pincode")
    public String getPincode() {
        return companyPincode;
    }

    public String getGstin() {
        return gstin;
    }

    public void setGstin(String gstin) {
        this.gstin = gstin;
    }

    @JsonProperty("reraNumber")
    public String getReraNumber() {
        return gstin;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    @JsonProperty("experienceYears")
    public Integer getExperienceYears() {
        return yearsOfExperience;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getVerificationNotes() {
        return verificationNotes;
    }

    public void setVerificationNotes(String verificationNotes) {
        this.verificationNotes = verificationNotes;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public List<ProviderDocumentDto> getDocuments() {
        return documents;
    }

    public void setDocuments(List<ProviderDocumentDto> documents) {
        this.documents = documents;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
