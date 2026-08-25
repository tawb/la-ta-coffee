package com.latacoffee.notification_service.order;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class OrderNotificationListener {

    private final JavaMailSender mailSender;

    public OrderNotificationListener(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @RabbitListener(queues = RabbitMQConfig.ORDER_QUEUE)//mirroring the rabbit template in order
    public void handleOrderCreated(OrderCreatedMessage message) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(message.customerEmail());
        email.setSubject("Your La Ta Coffee order is confirmed");
        email.setText(
            "Hi " + message.customerName() + ",\n\n" +
            "Your order #" + message.orderId() + " has been received.\n" +
            "Total: $" + message.total() + "\n\n" +
            "We'll have it ready soon!"
        );

        mailSender.send(email);
        System.out.println("Sent order confirmation email to " + message.customerEmail());
    }
}