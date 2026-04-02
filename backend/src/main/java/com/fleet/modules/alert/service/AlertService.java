package com.fleet.modules.alert.service;

import org.springframework.stereotype.Service;
import com.fleet.modules.telemetry.entity.Telemetry;

@Service
public class AlertService {

    public void checkAlerts(Telemetry t) {
        if (t.getSpeed() > 80) {
            System.out.println("Speeding Alert!");
        }

        if (t.getFuelLevel() < 10) {
            System.out.println("Low Fuel Alert!");
        }
    }
}