package com.fleet.modules.trip.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDateTime;

public record CompleteTripRequest(
    @NotNull LocalDateTime actualEndTime,
    @PositiveOrZero int actualDistance,
    @PositiveOrZero Double fuelUsed,
    String actualDuration,
    String remarks
) {}
