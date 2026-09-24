package com.directnest.sitevisit.dto;

import com.directnest.property.dto.PropertyListResponse;
import com.directnest.sitevisit.entity.SiteVisitStatus;
import com.directnest.user.dto.UserResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class SiteVisitResponse {
    private Long id;
    private PropertyListResponse property;
    private UserResponse customer;
    private LocalDate preferredDate;
    private String preferredTime;
    private String message;
    private SiteVisitStatus status;
    private String responseNote;
    private LocalDateTime createdAt;

    public SiteVisitResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PropertyListResponse getProperty() { return property; }
    public void setProperty(PropertyListResponse property) { this.property = property; }

    public UserResponse getCustomer() { return customer; }
    public void setCustomer(UserResponse customer) { this.customer = customer; }

    public LocalDate getPreferredDate() { return preferredDate; }
    public void setPreferredDate(LocalDate preferredDate) { this.preferredDate = preferredDate; }

    public String getPreferredTime() { return preferredTime; }
    public void setPreferredTime(String preferredTime) { this.preferredTime = preferredTime; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public SiteVisitStatus getStatus() { return status; }
    public void setStatus(SiteVisitStatus status) { this.status = status; }

    public String getResponseNote() { return responseNote; }
    public void setResponseNote(String responseNote) { this.responseNote = responseNote; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
