package com.directnest.enquiry.dto;

import com.directnest.enquiry.entity.EnquiryStatus;
import com.directnest.property.dto.PropertyListResponse;
import com.directnest.user.dto.UserResponse;

import java.time.LocalDateTime;

public class EnquiryResponse {
    private Long id;
    private PropertyListResponse property;
    private UserResponse customer;
    private String message;
    private String phone;
    private EnquiryStatus status;
    private String response;
    private LocalDateTime respondedAt;
    private LocalDateTime createdAt;

    public EnquiryResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PropertyListResponse getProperty() { return property; }
    public void setProperty(PropertyListResponse property) { this.property = property; }

    public UserResponse getCustomer() { return customer; }
    public void setCustomer(UserResponse customer) { this.customer = customer; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public EnquiryStatus getStatus() { return status; }
    public void setStatus(EnquiryStatus status) { this.status = status; }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }

    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
