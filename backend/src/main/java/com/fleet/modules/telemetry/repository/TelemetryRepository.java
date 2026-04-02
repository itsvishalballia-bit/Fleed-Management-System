package com.fleet.modules.telemetry.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fleet.modules.telemetry.entity.Telemetry;

public interface TelemetryRepository extends JpaRepository<Telemetry, Long> {
}