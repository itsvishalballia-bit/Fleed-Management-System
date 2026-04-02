package com.fleet.modules.telemetry.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fleet.modules.telemetry.service.TelemetryService;
import com.fleet.modules.telemetry.dto.TelemetryDTO;

@RestController
@RequestMapping("/api/telemetry")
public class TelemetryController {

    @Autowired
    private TelemetryService service;

    @PostMapping
    public ResponseEntity<String> receiveData(@RequestBody TelemetryDTO dto) {
        service.saveTelemetry(dto);
        return ResponseEntity.ok("Telemetry saved");
    }
}