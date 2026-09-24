package com.directnest.enquiry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateEnquiryRequest {

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 2000, message = "Message must be between 10 and 2000 characters")
    private String message;

    private String phone;

    public CreateEnquiryRequest() {}

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
