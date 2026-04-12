package com.campusTrade.backend.repository;

import com.campusTrade.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByListingIdAndBuyerEmail(Long listingId, String buyerEmail);
    Optional<Transaction> findByListingIdAndSellerEmail(Long listingId, String sellerEmail);
}