package com.campusTrade.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply.campustrade@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Verify your CampusTrade account");
        message.setText("Click the link below to verify your account:\n\n" +
                "http://localhost:8080/api/users/verify?token=" + token);
        mailSender.send(message);
    }
}