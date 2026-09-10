package com.latacoffee.auth_service.common;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import com.latacoffee.auth_service.auth.EmailSendException;
import jakarta.mail.internet.MimeMessage;

@Component
public class GmailProvider implements MailProvider {

    private final JavaMailSender mailSender;

    public GmailProvider(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void send(String to, String subject, String plainTextBody, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(plainTextBody, htmlBody);

            mailSender.send(message);
        } catch (Exception e) {
            throw new EmailSendException("Failed to send email to " + to, e);
        }
    }
}