package com.campusTrade.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "buyer_email", nullable = false)
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "seller_email", nullable = false)
    private User seller;

    @ManyToOne
    @JoinColumn(name = "listing_id", nullable = false)
    private Listing listing;

    private boolean inSafeZone = false;

    private LocalDateTime completedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public User getBuyer() { return buyer; }
    public void setBuyer(User buyer) { this.buyer = buyer; }
    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }
    public Listing getListing() { return listing; }
    public void setListing(Listing listing) { this.listing = listing; }
    public boolean isInSafeZone() { return inSafeZone; }
    public void setInSafeZone(boolean inSafeZone) { this.inSafeZone = inSafeZone; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}