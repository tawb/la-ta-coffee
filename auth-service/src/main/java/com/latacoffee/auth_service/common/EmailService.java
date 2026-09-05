package com.latacoffee.auth_service.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

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

    public void sendPasswordResetEmail(String toEmail, String resetToken) throws Exception {
        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

        Context context = new Context();
        context.setVariable("resetLink", resetLink);

        String htmlBody = templateEngine.process("password-reset-email", context);
        //System.out.println(htmlBody);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(toEmail);
        helper.setSubject("Reset your La Ta Coffee password");
        helper.setText(htmlBody, true);

        mailSender.send(message);
    }
}