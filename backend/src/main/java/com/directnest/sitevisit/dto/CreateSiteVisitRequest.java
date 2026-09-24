package com.directnest.sitevisit.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class CreateSiteVisitRequest {

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotNull(message = "Preferred date is required")
    @FutureOrPresent(message = "Preferred date cannot be in the past")
    private LocalDate preferredDate;

    @NotBlank(message = "Preferred time is required")
    private String preferredTime;

    @Size(max = 1000, message = "Message must not exceed 1000 characters")
    private String message;

    public CreateSiteVisitRequest() {}

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public LocalDate getPreferredDate() { return preferredDate; }
    public void setPreferredDate(LocalDate preferredDate) { this.preferredDate = preferredDate; }

    public String getPreferredTime() { return preferredTime; }
    public void setPreferredTime(String preferredTime) { this.preferredTime = preferredTime; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
