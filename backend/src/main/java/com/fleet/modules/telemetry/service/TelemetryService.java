package com.fleet.modules.telemetry.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fleet.modules.telemetry.repository.TelemetryRepository;
import com.fleet.modules.telemetry.entity.Telemetry;
import com.fleet.modules.telemetry.dto.TelemetryDTO;
import com.fleet.modules.alert.service.AlertService;

import java.time.LocalDateTime;

@Service
public class TelemetryService {

    @Autowired
    private TelemetryRepository repo;

    @Autowired
    private AlertService alertService;

    public void saveTelemetry(TelemetryDTO dto) {

        Telemetry t = new Telemetry();
        t.setVehicleId(dto.getVehicleId());
        t.setLatitude(dto.getLatitude());
        t.setLongitude(dto.getLongitude());
        t.setSpeed(dto.getSpeed());
        t.setFuelLevel(dto.getFuelLevel());
        t.setTimestamp(LocalDateTime.now());

        repo.save(t);

        alertService.checkAlerts(t);
    }
}