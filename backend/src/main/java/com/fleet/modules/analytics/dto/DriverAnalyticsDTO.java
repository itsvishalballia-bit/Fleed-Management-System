package com.fleet.modules.analytics.dto;

import java.time.LocalDateTime;
import java.util.List;

public record DriverAnalyticsDTO(
    LocalDateTime generatedAt,
    LocalDateTime startDate,
    LocalDateTime endDate,
    List<DashboardKpiDTO> kpis,
    double averageProductivityPercent,
    List<DriverAnalyticsRowDTO> productivityByDriver,
    List<AnalyticsTrendDTO> dutyTrend
) {}
