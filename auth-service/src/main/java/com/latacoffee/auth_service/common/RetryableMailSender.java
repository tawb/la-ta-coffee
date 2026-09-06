package com.latacoffee.auth_service.common;

import org.springframework.stereotype.Component;

@Component
public class RetryableMailSender {

    private final MailProvider mailProvider;

    public RetryableMailSender(MailProvider mailProvider) {
        this.mailProvider = mailProvider;
    }

    @RetryOnFailure(maxAttempts = 3, delayMs = 1000)
    public void send(String toEmail, String subject, String plainTextBody, String htmlBody) {
        mailProvider.send(toEmail, subject, plainTextBody, htmlBody);
    }
}