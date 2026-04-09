package com.fleet.modules.analytics.dto;

import java.time.LocalDateTime;
import java.util.List;

public record VehicleAnalyticsDTO(
    LocalDateTime generatedAt,
    LocalDateTime startDate,
    LocalDateTime endDate,
    List<DashboardKpiDTO> kpis,
    double averageUtilizationPercent,
    List<VehicleAnalyticsRowDTO> utilizationByVehicle,
    List<AnalyticsTrendDTO> maintenanceTrends
) {}
