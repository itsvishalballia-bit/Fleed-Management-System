package com.fleet.modules.analytics.dto;

public record AnalyticsTrendDTO(
    String label,
    long count,
    String note
) {}
