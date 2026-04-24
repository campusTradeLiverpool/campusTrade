package com.campusTrade.backend.service;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${RESEND_API_KEY}")
    private String resendApiKey;

    @Value("${APP_FRONTEND_URL}")
    private String frontendUrl;

    public void sendTransactionEmail(String toEmail, String subject, String body) {
        Resend resend = new Resend(resendApiKey);
        CreateEmailOptions params = CreateEmailOptions.builder()
            .from("noreply@joelstani.land")
            .to(toEmail)
            .subject(subject)
            .text(body)
            .build();
        try {
            resend.emails().send(params);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendVerificationEmail(String toEmail, String token) {
        String verifyUrl = frontendUrl + "/verify?token=" + token;
        sendTransactionEmail(
            toEmail,
            "Verify your CampusTrade account",
            "Click the link below to verify your account:\n\n" + verifyUrl
        );
    }
}