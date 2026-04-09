package com.fleet.modules.audit.dto;

import java.time.LocalDateTime;

public record AuditLogDTO(
    String id,
    String actor,
    String action,
    String entityType,
    String entityId,
    String summary,
    String detailsJson,
    LocalDateTime createdAt
) {}
