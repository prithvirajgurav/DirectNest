package com.directnest.enquiry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RespondEnquiryRequest {

    @NotBlank(message = "Response message is required")
    @Size(min = 5, max = 2000, message = "Response must be between 5 and 2000 characters")
    private String response;

    public RespondEnquiryRequest() {}

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
}
