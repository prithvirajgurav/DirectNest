package com.directnest.sitevisit.entity;

import com.directnest.common.entity.BaseEntity;
import com.directnest.property.entity.Property;
import com.directnest.user.entity.User;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "site_visits")
public class SiteVisit extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(name = "preferred_date", nullable = false)
    private LocalDate preferredDate;

    @Column(name = "preferred_time", nullable = false, length = 50)
    private String preferredTime;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private SiteVisitStatus status = SiteVisitStatus.REQUESTED;

    @Column(name = "response_note", columnDefinition = "TEXT")
    private String responseNote;

    public SiteVisit() {
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public LocalDate getPreferredDate() {
        return preferredDate;
    }

    public void setPreferredDate(LocalDate preferredDate) {
        this.preferredDate = preferredDate;
    }

    public String getPreferredTime() {
        return preferredTime;
    }

    public void setPreferredTime(String preferredTime) {
        this.preferredTime = preferredTime;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public SiteVisitStatus getStatus() {
        return status;
    }

    public void setStatus(SiteVisitStatus status) {
        this.status = status;
    }

    public String getResponseNote() {
        return responseNote;
    }

    public void setResponseNote(String responseNote) {
        this.responseNote = responseNote;
    }
}
