package com.campusTrade.backend.service;

import com.campusTrade.backend.model.Listing;
import com.campusTrade.backend.model.User;
import com.campusTrade.backend.repository.ListingRepository;
import com.campusTrade.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ListingService {

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private UserRepository userRepository;

    public Listing createListing(Map<String, String> data) {
        User seller = userRepository.findById(data.get("sellerEmail"))
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Listing listing = new Listing();
        listing.setSeller(seller);
        listing.setTitle(data.get("title"));
        listing.setDescription(data.get("description"));
        listing.setPrice(new java.math.BigDecimal(data.get("price")));
        listing.setCategory(data.get("category"));
        listing.setConditionReport(data.get("conditionReport"));
        listing.setAvailable(true);
        listing.setImageUrl(data.get("imageUrl"));

        return listingRepository.save(listing);
    }

    public List<Listing> getAllListings() {
        return listingRepository.findByIsAvailableTrue();
    }
}