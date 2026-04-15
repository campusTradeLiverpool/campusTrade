package com.campusTrade.backend.service;

import com.campusTrade.backend.model.User;
import com.campusTrade.backend.model.VerificationToken;
import com.campusTrade.backend.repository.UserRepository;
import com.campusTrade.backend.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(User user) {
        if (!user.getEmail().endsWith(".ac.uk")) {
            throw new IllegalArgumentException("Only .ac.uk email addresses are allowed");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerified(true);
        userRepository.save(user);

        try {
            VerificationToken token = new VerificationToken();
            token.setToken(UUID.randomUUID().toString());
            token.setUser(user);
            token.setExpiresAt(LocalDateTime.now().plusHours(24));
            tokenRepository.save(token);
            emailService.sendVerificationEmail(user.getEmail(), token.getToken());
        } catch (Exception e) {
            System.out.println("Email sending failed: " + e.getMessage());
        }

        return user;
    }

    public User loginUser(String email, String password) {
        User user = userRepository.findById(email)
            .orElseThrow(() -> new IllegalArgumentException("No account found with this email"));

        if (!user.isVerified()) {
            throw new IllegalArgumentException("Please verify your email before logging in");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Incorrect password");
        }

        return user;
    }
}