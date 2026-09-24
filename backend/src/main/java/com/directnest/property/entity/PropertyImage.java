package com.directnest.property.entity;

import com.directnest.common.entity.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "property_images")
public class PropertyImage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "is_primary", nullable = false)
    private boolean primary = false;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    public PropertyImage() {}

    public PropertyImage(Property property, String imageUrl, boolean primary, Integer displayOrder) {
        this.property = property;
        this.imageUrl = imageUrl;
        this.primary = primary;
        this.displayOrder = displayOrder;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Property property;
        private String imageUrl;
        private boolean primary = false;
        private Integer displayOrder = 0;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder property(Property property) {
            this.property = property;
            return this;
        }

        public Builder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public Builder primary(boolean primary) {
            this.primary = primary;
            return this;
        }

        public Builder displayOrder(Integer displayOrder) {
            this.displayOrder = displayOrder;
            return this;
        }

        public PropertyImage build() {
            PropertyImage img = new PropertyImage(property, imageUrl, primary, displayOrder);
            if (id != null) {
                img.setId(id);
            }
            return img;
        }
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isPrimary() {
        return primary;
    }

    public void setPrimary(boolean primary) {
        this.primary = primary;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
