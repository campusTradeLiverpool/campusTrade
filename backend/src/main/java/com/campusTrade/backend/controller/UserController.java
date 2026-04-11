package com.campusTrade.backend.controller;

import com.campusTrade.backend.model.User;
import com.campusTrade.backend.model.VerificationToken;
import com.campusTrade.backend.repository.VerificationTokenRepository;
import com.campusTrade.backend.repository.UserRepository;
import com.campusTrade.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User saved = userService.registerUser(user);
            return ResponseEntity.ok("Registration successful for " + saved.getEmail());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    
    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String token) {
        Optional<VerificationToken> optionalToken = tokenRepository.findByToken(token);

        if (optionalToken.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid verification token");
        }

        VerificationToken verificationToken = optionalToken.get();

        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Token has expired");
        }

        User user = verificationToken.getUser();
        user.setVerified(true);
        userRepository.save(user);

        return ResponseEntity.ok("Account verified successfully for " + user.getEmail());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            User user = userService.loginUser(
                credentials.get("email"),
                credentials.get("password")
            );
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}