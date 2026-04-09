package com.fleet.modules.analytics.dto;

import com.fleet.modules.trip.entity.TripStatus;
import java.time.LocalDateTime;

public record TripAnalyticsRowDTO(
    String tripId,
    String routeId,
    String vehicleId,
    String driverId,
    TripStatus status,
    LocalDateTime plannedEndTime,
    LocalDateTime actualEndTime,
    Integer delayMinutes,
    int actualDistance,
    Double fuelUsed,
    LocalDateTime completionProcessedAt
) {}
