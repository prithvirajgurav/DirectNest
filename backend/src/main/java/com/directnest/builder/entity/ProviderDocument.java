package com.directnest.builder.entity;

import com.directnest.common.entity.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "provider_documents")
public class ProviderDocument extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_profile_id", nullable = false)
    private ProviderProfile providerProfile;

    @Column(name = "document_type", nullable = false)
    private String documentType;

    @Column(name = "document_url", nullable = false)
    private String documentUrl;

    public ProviderDocument() {}

    public ProviderDocument(ProviderProfile providerProfile, String documentType, String documentUrl) {
        this.providerProfile = providerProfile;
        this.documentType = documentType;
        this.documentUrl = documentUrl;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private ProviderProfile providerProfile;
        private String documentType;
        private String documentUrl;

        public Builder providerProfile(ProviderProfile providerProfile) {
            this.providerProfile = providerProfile;
            return this;
        }

        public Builder documentType(String documentType) {
            this.documentType = documentType;
            return this;
        }

        public Builder documentUrl(String documentUrl) {
            this.documentUrl = documentUrl;
            return this;
        }

        public ProviderDocument build() {
            return new ProviderDocument(providerProfile, documentType, documentUrl);
        }
    }

    public ProviderProfile getProviderProfile() {
        return providerProfile;
    }

    public void setProviderProfile(ProviderProfile providerProfile) {
        this.providerProfile = providerProfile;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getDocumentUrl() {
        return documentUrl;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }
}
