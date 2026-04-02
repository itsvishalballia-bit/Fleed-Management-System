package com.fleet.modules.telemetry.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Telemetry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleId;
    private double latitude;
    private double longitude;
    private double speed;
    private double fuelLevel;
    private LocalDateTime timestamp;

    // Getters and Setters
}