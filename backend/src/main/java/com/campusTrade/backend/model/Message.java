package com.campusTrade.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_email", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_email", nullable = false)
    private User receiver;

    @ManyToOne
    @JoinColumn(name = "listing_id", nullable = false)
    private Listing listing;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private LocalDateTime sentAt = LocalDateTime.now();

    public Long getId() { return id; }
    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }
    public User getReceiver() { return receiver; }
    public void setReceiver(User receiver) { this.receiver = receiver; }
    public Listing getListing() { return listing; }
    public void setListing(Listing listing) { this.listing = listing; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getSentAt() { return sentAt; }
}