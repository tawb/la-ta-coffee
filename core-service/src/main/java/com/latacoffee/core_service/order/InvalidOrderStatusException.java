package com.latacoffee.core_service.order;

public class InvalidOrderStatusException extends RuntimeException {
    public InvalidOrderStatusException(String status) {
        super("Invalid order status: " + status);
    }
}