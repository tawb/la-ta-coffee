package com.latacoffee.auth_service.common;

public interface MailProvider {
    void send(String to, String subject, String plainTextBody, String htmlBody);
}