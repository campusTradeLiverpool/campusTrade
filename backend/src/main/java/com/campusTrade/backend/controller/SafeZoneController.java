package com.campusTrade.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/safezone")
public class SafeZoneController {

    // University of Liverpool safe zones — centre coordinates and radius in metres
    private static final double[][] SAFE_ZONES = {
        {53.4048, -2.9660, 200},  // Main campus
        {53.4063, -2.9663, 100},  // Guild of Students
        {53.4034, -2.9656, 100},  // Sydney Jones Library
        {53.4051, -2.9634, 100},  // Sports Centre
    };

    @PostMapping("/validate")
    public ResponseEntity<?> validate(@RequestBody Map<String, Double> coords) {
        double lat = coords.get("lat");
        double lng = coords.get("lng");

        for (double[] zone : SAFE_ZONES) {
            double distance = haversine(lat, lng, zone[0], zone[1]);
            if (distance <= zone[2]) {
                return ResponseEntity.ok(Map.of("inZone", true, "message", "You are in a safe zone"));
            }
        }

        return ResponseEntity.ok(Map.of("inZone", false, "message", "You are not in a University of Liverpool safe zone"));
    }

    private double haversine(double lat1, double lng1, double lat2, double lng2) {
        final int R = 6371000;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}