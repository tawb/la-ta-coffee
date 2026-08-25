package com.latacoffee.notification_service.order;

import java.io.Serializable;

public record OrderCreatedMessage(String customerEmail, String customerName, String orderId, double total) implements Serializable {
}