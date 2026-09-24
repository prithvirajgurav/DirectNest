package com.directnest.report.dto;

import com.directnest.property.dto.PropertyListResponse;
import com.directnest.report.entity.ReportStatus;
import com.directnest.user.dto.UserResponse;

import java.time.LocalDateTime;

public class PropertyReportResponse {
    private Long id;
    private UserResponse user;
    private PropertyListResponse property;
    private String reason;
    private String description;
    private ReportStatus status;
    private String adminNotes;
    private LocalDateTime createdAt;

    public PropertyReportResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }

    public PropertyListResponse getProperty() { return property; }
    public void setProperty(PropertyListResponse property) { this.property = property; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ReportStatus getStatus() { return status; }
    public void setStatus(ReportStatus status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
