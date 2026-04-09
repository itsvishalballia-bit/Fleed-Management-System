package com.fleet.modules.analytics.dto;

public record DriverAnalyticsRowDTO(
    String driverId,
    String name,
    String status,
    String licenseType,
    String assignedVehicleId,
    double hoursDrivenToday,
    int totalTrips,
    int completedTrips,
    double productivityPercent,
    String note
) {}
