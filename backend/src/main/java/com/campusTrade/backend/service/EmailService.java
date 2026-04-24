package com.campusTrade.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void sendTransactionEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply.campustrade@gmail.com");
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void sendVerificationEmail(String toEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply.campustrade@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Verify your CampusTrade account");
        message.setText("Click the link below to verify your account:\n\n" +
                frontendUrl + "/api/users/verify?token=" + token);
        mailSender.send(message);
    }

    public void sendSellerConfirmationEmail(String toEmail, Long transactionId, String jwtToken) {
        String confirmUrl = frontendUrl + "/confirm/" + transactionId + "?token=" + jwtToken;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply.campustrade@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Confirm your CampusTrade sale");
        message.setText(
            "A buyer has confirmed they want to complete the trade.\n\n" +
            "Click the link below when you are in a University of Liverpool safe zone to confirm:\n\n" +
            confirmUrl
        );
        mailSender.send(message);
    }
}