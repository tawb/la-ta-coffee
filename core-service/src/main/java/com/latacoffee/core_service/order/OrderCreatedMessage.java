package com.latacoffee.core_service.order;

import java.io.Serializable;//Serializable is the marker interface that tells Java "this class is allowed to be converted to/from a byte stream

public record OrderCreatedMessage(String customerEmail, String customerName, String orderId, double total) implements Serializable {
}