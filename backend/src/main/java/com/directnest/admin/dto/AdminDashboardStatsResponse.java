package com.directnest.admin.dto;

public class AdminDashboardStatsResponse {
    private long totalUsers;
    private long totalCustomers;
    private long totalBuilders;
    private long totalProperties;
    private long approvedProperties;
    private long pendingProperties;
    private long rejectedProperties;
    private long totalEnquiries;
    private long totalSiteVisits;
    private long pendingVerifications;
    private long openReports;

    public AdminDashboardStatsResponse() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getTotalBuilders() { return totalBuilders; }
    public void setTotalBuilders(long totalBuilders) { this.totalBuilders = totalBuilders; }

    public long getTotalProperties() { return totalProperties; }
    public void setTotalProperties(long totalProperties) { this.totalProperties = totalProperties; }

    public long getApprovedProperties() { return approvedProperties; }
    public void setApprovedProperties(long approvedProperties) { this.approvedProperties = approvedProperties; }

    public long getPendingProperties() { return pendingProperties; }
    public void setPendingProperties(long pendingProperties) { this.pendingProperties = pendingProperties; }

    public long getRejectedProperties() { return rejectedProperties; }
    public void setRejectedProperties(long rejectedProperties) { this.rejectedProperties = rejectedProperties; }

    public long getTotalEnquiries() { return totalEnquiries; }
    public void setTotalEnquiries(long totalEnquiries) { this.totalEnquiries = totalEnquiries; }

    public long getTotalSiteVisits() { return totalSiteVisits; }
    public void setTotalSiteVisits(long totalSiteVisits) { this.totalSiteVisits = totalSiteVisits; }

    public long getPendingVerifications() { return pendingVerifications; }
    public void setPendingVerifications(long pendingVerifications) { this.pendingVerifications = pendingVerifications; }

    public long getOpenReports() { return openReports; }
    public void setOpenReports(long openReports) { this.openReports = openReports; }
}
