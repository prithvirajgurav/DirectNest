package com.directnest.property.entity;

import com.directnest.common.entity.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "property_documents")
public class PropertyDocument extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "document_type", nullable = false)
    private String documentType;

    @Column(name = "document_url", nullable = false)
    private String documentUrl;

    public PropertyDocument() {}

    public PropertyDocument(Property property, String documentType, String documentUrl) {
        this.property = property;
        this.documentType = documentType;
        this.documentUrl = documentUrl;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Property property;
        private String documentType;
        private String documentUrl;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder property(Property property) {
            this.property = property;
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

        public PropertyDocument build() {
            PropertyDocument doc = new PropertyDocument(property, documentType, documentUrl);
            if (id != null) {
                doc.setId(id);
            }
            return doc;
        }
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
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
