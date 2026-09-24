package com.directnest.sitevisit.dto;

import com.directnest.sitevisit.entity.SiteVisitStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateSiteVisitStatusRequest {

    @NotNull(message = "Status is required")
    private SiteVisitStatus status;

    @Size(max = 1000, message = "Response note must not exceed 1000 characters")
    private String responseNote;

    public UpdateSiteVisitStatusRequest() {}

    public SiteVisitStatus getStatus() { return status; }
    public void setStatus(SiteVisitStatus status) { this.status = status; }

    public String getResponseNote() { return responseNote; }
    public void setResponseNote(String responseNote) { this.responseNote = responseNote; }
}
