package com.latacoffee.auth_service.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.latacoffee.auth_service.auth.EmailSendException;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final String frontendUrl;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine,
                         @Value("${app.frontend-url}") String frontendUrl) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.frontendUrl = frontendUrl;
    }
    @RetryOnFailure(maxAttempts = 3, delayMs = 1000)
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

        Context context = new Context();
        context.setVariable("resetLink", resetLink);

        String htmlBody = templateEngine.process("password-reset-email", context);
        String plainTextBody = "Someone requested a password reset for your account.\n\n" +
                "Click this link to set a new password:\n" + resetLink + "\n\n" +
                "This link expires in 30 minutes. If you didn't request this, ignore this email.";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("Reset your La Ta Coffee password");
            helper.setText(plainTextBody, htmlBody);

            mailSender.send(message);
        } catch (Exception e) {
            throw new EmailSendException("Failed to send password reset email to " + toEmail, e);
        }
    }
    @RetryOnFailure(maxAttempts = 3, delayMs = 1000)
    public void sendWelcomeEmail(String toEmail, String name) {
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("siteUrl", frontendUrl);

        String htmlBody = templateEngine.process("welcome-email", context);
        String plainTextBody = "Welcome, " + name + ".\n\n" +
                "Your account is ready. Twelve seats, one table, roasted this week, gone when it's gone.\n\n" +
                "Visit us at " + frontendUrl;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("Welcome to La Ta Coffee");
            helper.setText(plainTextBody, htmlBody);

            mailSender.send(message);
        } catch (Exception e) {
            throw new EmailSendException("Failed to send welcome email to " + toEmail, e);
        }
    }
}