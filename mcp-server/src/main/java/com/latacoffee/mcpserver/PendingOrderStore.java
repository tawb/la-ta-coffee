package com.latacoffee.mcpserver;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import com.latacoffee.mcpserver.dto.OrderRequest;

@Component
public class PendingOrderStore {

    private record PendingOrder(String userEmail, OrderRequest request) {}

    private final Map<String, PendingOrder> pending = new ConcurrentHashMap<>();

    public String store(String userEmail, OrderRequest request) {
        String token = UUID.randomUUID().toString();
        pending.put(token, new PendingOrder(userEmail, request));
        return token;
    }

    public OrderRequest retrieveAndRemove(String token, String userEmail) {
        PendingOrder order = pending.get(token);

        if (order == null) {
            throw new IllegalArgumentException("This order preview doesn't exist. Please start over.");
        }

        if (!order.userEmail().equals(userEmail)) {
            throw new SecurityException("This order preview doesn't belong to you.");
        }

        pending.remove(token);
        return order.request();
    }
}