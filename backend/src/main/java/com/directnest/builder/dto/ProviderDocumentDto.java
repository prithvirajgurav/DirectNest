package com.directnest.builder.dto;

import java.time.LocalDateTime;

public class ProviderDocumentDto {
    private Long id;
    private String documentType;
    private String documentUrl;
    private LocalDateTime createdAt;

    public ProviderDocumentDto() {}

    public ProviderDocumentDto(Long id, String documentType, String documentUrl, LocalDateTime createdAt) {
        this.id = id;
        this.documentType = documentType;
        this.documentUrl = documentUrl;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String documentType;
        private String documentUrl;
        private LocalDateTime createdAt;

        public Builder id(Long id) {
            this.id = id;
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

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ProviderDocumentDto build() {
            return new ProviderDocumentDto(id, documentType, documentUrl, createdAt);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
