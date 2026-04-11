package com.campusTrade.backend.controller;

import com.campusTrade.backend.model.Listing;
import com.campusTrade.backend.service.ListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    @Autowired
    private ListingService listingService;

    @PostMapping
    public ResponseEntity<?> createListing(@RequestBody Map<String, String> data) {
        try {
            Listing listing = listingService.createListing(data);
            return ResponseEntity.ok("Listing created: " + listing.getTitle());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Listing>> getAllListings() {
        return ResponseEntity.ok(listingService.getAllListings());
    }
}