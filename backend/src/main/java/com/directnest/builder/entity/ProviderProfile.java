package com.directnest.builder.entity;

import com.directnest.common.entity.BaseEntity;
import com.directnest.user.entity.User;
import jakarta.persistence.*;

@Entity
@Table(name = "provider_profiles")
public class ProviderProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider_type", nullable = false)
    private ProviderType providerType;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "company_description", columnDefinition = "TEXT")
    private String companyDescription;

    @Column(name = "company_address")
    private String companyAddress;

    @Column(name = "company_city")
    private String companyCity;

    @Column(name = "company_state")
    private String companyState;

    @Column(name = "company_pincode")
    private String companyPincode;

    @Column(name = "gstin")
    private String gstin;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(name = "website_url")
    private String websiteUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING_VERIFICATION;

    @Column(name = "verification_notes", columnDefinition = "TEXT")
    private String verificationNotes;

    @Column(name = "verified_at")
    private java.time.LocalDateTime verifiedAt;

    public ProviderProfile() {}

    public ProviderProfile(User user, ProviderType providerType, String companyName, String companyDescription,
                           String companyAddress, String companyCity, String companyState, String companyPincode,
                           String gstin, Integer yearsOfExperience, String websiteUrl,
                           VerificationStatus verificationStatus, String verificationNotes,
                           java.time.LocalDateTime verifiedAt) {
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
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private User user;
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
        private VerificationStatus verificationStatus = VerificationStatus.PENDING_VERIFICATION;
        private String verificationNotes;
        private java.time.LocalDateTime verifiedAt;

        public Builder user(User user) {
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

        public Builder verifiedAt(java.time.LocalDateTime verifiedAt) {
            this.verifiedAt = verifiedAt;
            return this;
        }

        public ProviderProfile build() {
            return new ProviderProfile(user, providerType, companyName, companyDescription, companyAddress,
                    companyCity, companyState, companyPincode, gstin, yearsOfExperience, websiteUrl,
                    verificationStatus, verificationNotes, verifiedAt);
        }
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
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

    public String getCompanyDescription() {
        return companyDescription;
    }

    public void setCompanyDescription(String companyDescription) {
        this.companyDescription = companyDescription;
    }

    public String getCompanyAddress() {
        return companyAddress;
    }

    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
    }

    public String getCompanyCity() {
        return companyCity;
    }

    public void setCompanyCity(String companyCity) {
        this.companyCity = companyCity;
    }

    public String getCompanyState() {
        return companyState;
    }

    public void setCompanyState(String companyState) {
        this.companyState = companyState;
    }

    public String getCompanyPincode() {
        return companyPincode;
    }

    public void setCompanyPincode(String companyPincode) {
        this.companyPincode = companyPincode;
    }

    public String getGstin() {
        return gstin;
    }

    public void setGstin(String gstin) {
        this.gstin = gstin;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
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

    public java.time.LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(java.time.LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}
