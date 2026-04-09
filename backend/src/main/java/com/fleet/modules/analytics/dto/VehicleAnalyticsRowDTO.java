package com.fleet.modules.analytics.dto;

public record VehicleAnalyticsRowDTO(
    String vehicleId,
    String name,
    String status,
    String location,
    int mileage,
    boolean maintenanceDue,
    int totalTrips,
    int completedTrips,
    int activeTrips,
    double utilizationPercent,
    String note
) {}
