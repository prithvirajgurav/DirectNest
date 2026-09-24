package com.directnest.amenity.entity;

import com.directnest.common.entity.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "amenities")
public class Amenity extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String icon;

    private String category;

    public Amenity() {}

    public Amenity(String name, String icon, String category) {
        this.name = name;
        this.icon = icon;
        this.category = category;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String icon;
        private String category;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder icon(String icon) {
            this.icon = icon;
            return this;
        }

        public Builder category(String category) {
            this.category = category;
            return this;
        }

        public Amenity build() {
            Amenity amenity = new Amenity(name, icon, category);
            if (id != null) {
                amenity.setId(id);
            }
            return amenity;
        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
