package com.campusTrade.backend.controller;

import com.campusTrade.backend.model.Transaction;
import com.campusTrade.backend.model.User;
import com.campusTrade.backend.model.Listing;
import com.campusTrade.backend.repository.TransactionRepository;
import com.campusTrade.backend.repository.UserRepository;
import com.campusTrade.backend.repository.ListingRepository;
import com.campusTrade.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired private TransactionRepository transactionRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ListingRepository listingRepository;
    @Autowired private EmailService emailService;

    @PostMapping("/buyer-confirm")
    public ResponseEntity<?> buyerConfirm(@RequestBody Map<String, String> data) {
        try {
            User buyer = userRepository.findById(data.get("buyerEmail"))
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found"));
            User seller = userRepository.findById(data.get("sellerEmail"))
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));
            Listing listing = listingRepository.findById(Long.parseLong(data.get("listingId")))
                .orElseThrow(() -> new IllegalArgumentException("Listing not found"));

            Transaction transaction = new Transaction();
            transaction.setBuyer(buyer);
            transaction.setSeller(seller);
            transaction.setListing(listing);
            transaction.setInSafeZone(Boolean.parseBoolean(data.get("inSafeZone")));
            transaction.setBuyerConfirmed(true);
            transaction.setSellerConfirmed(false);
            transactionRepository.save(transaction);

            String confirmUrl = "https://campus-trade-orcin.vercel.app/confirm-transaction/" + transaction.getId() + "\"";

            emailService.sendTransactionEmail(
                seller.getEmail(),
                "CampusTrade — Confirm your sale",
                "Hi " + seller.getName() + ",\n\n" +
                buyer.getName() + " has confirmed the meetup for your listing: " + listing.getTitle() + ".\n\n" +
                "Click the link below when you are in a University of Liverpool safe zone to confirm the trade:\n\n" +
                confirmUrl + "\n\n" +
                "CampusTrade Team"
            );

            return ResponseEntity.ok("Buyer confirmed. Seller has been notified by email.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/seller-confirm/{transactionId}")
    public ResponseEntity<?> sellerConfirm(@PathVariable Long transactionId, @RequestBody Map<String, String> data) {
        try {
            Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

            if (!transaction.getSeller().getEmail().equals(data.get("sellerEmail"))) {
                return ResponseEntity.status(403).body("Not authorised");
            }

            transaction.setSellerConfirmed(true);
            transaction.setCompletedAt(LocalDateTime.now());

            Listing listing = transaction.getListing();
            listing.setAvailable(false);
            listingRepository.save(listing);
            transactionRepository.save(transaction);

            emailService.sendTransactionEmail(
                transaction.getBuyer().getEmail(),
                "CampusTrade — Transaction Complete",
                "Hi " + transaction.getBuyer().getName() + ",\n\n" +
                "Your transaction for " + listing.getTitle() + " has been confirmed by the seller.\n\n" +
                "The listing has been removed from CampusTrade. Enjoy your purchase!\n\n" +
                "CampusTrade"
            );

            emailService.sendTransactionEmail(
                transaction.getSeller().getEmail(),
                "CampusTrade — Transaction Complete",
                "Hi " + transaction.getSeller().getName() + ",\n\n" +
                "You have confirmed the sale of " + listing.getTitle() + ".\n\n" +
                "The listing has been removed from CampusTrade. Well done!\n\n" +
                "CampusTrade"
            );

            return ResponseEntity.ok("Transaction complete. Both users have been notified.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}