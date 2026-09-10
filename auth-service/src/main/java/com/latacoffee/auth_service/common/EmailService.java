package com.latacoffee.auth_service.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final RetryableMailSender retryableMailSender;
    private final TemplateEngine templateEngine;
    private final String frontendUrl;

    public EmailService(RetryableMailSender retryableMailSender, TemplateEngine templateEngine,
                         @Value("${app.frontend-url}") String frontendUrl) {
        this.retryableMailSender = retryableMailSender;
        this.templateEngine = templateEngine;
        this.frontendUrl = frontendUrl;
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

            Context context = new Context();
            context.setVariable("resetLink", resetLink);

            String htmlBody = templateEngine.process("password-reset-email", context);
            String plainTextBody = "Someone requested a password reset for your account.\n\n" +
                    "Click this link to set a new password:\n" + resetLink + "\n\n" +
                    "This link expires in 30 minutes. If you didn't request this, ignore this email.";

            retryableMailSender.send(toEmail, "Reset your La Ta Coffee password", plainTextBody, htmlBody);
        } catch (Exception e) {
            log.error("Password reset email ultimately failed for {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String name) {
        try {
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("siteUrl", frontendUrl);

            String htmlBody = templateEngine.process("welcome-email", context);
            String plainTextBody = "Welcome, " + name + ".\n\n" +
                    "Your account is ready. Twelve seats, one table, roasted this week, gone when it's gone.\n\n" +
                    "Visit us at " + frontendUrl;

            retryableMailSender.send(toEmail, "Welcome to La Ta Coffee", plainTextBody, htmlBody);
        } catch (Exception e) {
            log.error("Welcome email ultimately failed for {}: {}", toEmail, e.getMessage());
        }
    }
}