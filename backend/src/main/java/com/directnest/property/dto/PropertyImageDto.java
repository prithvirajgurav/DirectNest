package com.directnest.property.dto;

import java.time.LocalDateTime;

public class PropertyImageDto {
    private Long id;
    private String imageUrl;
    private boolean primary;
    private Integer displayOrder;
    private LocalDateTime createdAt;

    public PropertyImageDto() {}

    public PropertyImageDto(Long id, String imageUrl, boolean primary, Integer displayOrder, LocalDateTime createdAt) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.primary = primary;
        this.displayOrder = displayOrder;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String imageUrl;
        private boolean primary;
        private Integer displayOrder;
        private LocalDateTime createdAt;

        public Builder id(Long id) {
            this.id = id;
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

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public PropertyImageDto build() {
            return new PropertyImageDto(id, imageUrl, primary, displayOrder, createdAt);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
