package com.directnest.property.dto;

import com.directnest.property.entity.PropertyStatus;
import jakarta.validation.constraints.NotNull;

public class VerifyPropertyRequest {

    @NotNull(message = "Property status is required (APPROVED or REJECTED)")
    private PropertyStatus status;

    private String adminNotes;
    private String rejectionReason;

    public VerifyPropertyRequest() {}

    public VerifyPropertyRequest(PropertyStatus status, String adminNotes, String rejectionReason) {
        this.status = status;
        this.adminNotes = adminNotes;
        this.rejectionReason = rejectionReason;
    }

    public PropertyStatus getStatus() {
        return status;
    }

    public void setStatus(PropertyStatus status) {
        this.status = status;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
