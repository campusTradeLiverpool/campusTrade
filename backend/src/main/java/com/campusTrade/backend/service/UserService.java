package com.campusTrade.backend.service;

import com.campusTrade.backend.model.User;
import com.campusTrade.backend.model.VerificationToken;
import com.campusTrade.backend.repository.UserRepository;
import com.campusTrade.backend.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    public User registerUser(User user) {
        if (!user.getEmail().endsWith(".ac.uk")) {
            throw new IllegalArgumentException("Only .ac.uk email addresses are allowed");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        user.setVerified(false);
        userRepository.save(user);

        // Generate verification token
        VerificationToken token = new VerificationToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiresAt(LocalDateTime.now().plusHours(24));
        tokenRepository.save(token);

        // Send email
        emailService.sendVerificationEmail(user.getEmail(), token.getToken());

        return user;
    }
}