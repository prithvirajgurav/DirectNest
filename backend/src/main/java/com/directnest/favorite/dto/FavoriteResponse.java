package com.directnest.favorite.dto;

import com.directnest.property.dto.PropertyListResponse;
import java.time.LocalDateTime;

public class FavoriteResponse {
    private Long id;
    private Long userId;
    private PropertyListResponse property;
    private LocalDateTime createdAt;

    public FavoriteResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public PropertyListResponse getProperty() { return property; }
    public void setProperty(PropertyListResponse property) { this.property = property; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
