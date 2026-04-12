package com.campusTrade.backend.service;

import com.campusTrade.backend.model.Message;
import com.campusTrade.backend.model.User;
import com.campusTrade.backend.model.Listing;
import com.campusTrade.backend.repository.MessageRepository;
import com.campusTrade.backend.repository.UserRepository;
import com.campusTrade.backend.repository.ListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ListingRepository listingRepository;

    public List<Message> getInbox(String email) {
        List<Message> allMessages = messageRepository.findBySenderEmailOrReceiverEmail(email, email);
        
        Map<String, Message> latestMessages = new java.util.LinkedHashMap<>();
        
        for (Message msg : allMessages) {
            String otherUser = msg.getSender().getEmail().equals(email) 
                ? msg.getReceiver().getEmail() 
                : msg.getSender().getEmail();
            String key = otherUser + "_" + msg.getListing().getId();
            latestMessages.put(key, msg);
        }
        
        return new java.util.ArrayList<>(latestMessages.values());
    }

    public Message sendMessage(Map<String, String> data) {
        User sender = userRepository.findById(data.get("senderEmail"))
            .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        User receiver = userRepository.findById(data.get("receiverEmail"))
            .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));
        Listing listing = listingRepository.findById(Long.parseLong(data.get("listingId")))
            .orElseThrow(() -> new IllegalArgumentException("Listing not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setListing(listing);
        message.setContent(data.get("content"));

        return messageRepository.save(message);
    }

    public List<Message> getConversation(String userEmail, Long listingId) {
        return messageRepository.findConversation(listingId, userEmail);
    }
}