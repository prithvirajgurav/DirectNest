package com.directnest.builder.dto;

import com.directnest.builder.entity.VerificationStatus;
import jakarta.validation.constraints.NotNull;

public class VerifyProviderRequest {

    @NotNull(message = "Verification status is required (APPROVED or REJECTED)")
    private VerificationStatus status;

    private String notes;

    public VerifyProviderRequest() {}

    public VerifyProviderRequest(VerificationStatus status, String notes) {
        this.status = status;
        this.notes = notes;
    }

    public VerificationStatus getStatus() {
        return status;
    }

    public void setStatus(VerificationStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getRejectionReason() {
        return notes;
    }

    public void setRejectionReason(String rejectionReason) {
        this.notes = rejectionReason;
    }
}
