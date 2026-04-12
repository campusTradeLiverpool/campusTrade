package com.campusTrade.backend.repository;

import com.campusTrade.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
    
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    @Query("SELECT m FROM Message m WHERE m.listing.id = :listingId AND (m.sender.email = :email OR m.receiver.email = :email) ORDER BY m.sentAt ASC")
    List<Message> findConversation(@Param("listingId") Long listingId, @Param("email") String email);
    
    List<Message> findBySenderEmailOrReceiverEmail(String senderEmail, String receiverEmail);
    
    @Transactional
    void deleteByListingId(Long listingId);
}