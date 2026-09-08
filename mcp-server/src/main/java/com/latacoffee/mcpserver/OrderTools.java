package com.latacoffee.mcpserver;

import java.util.List;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.latacoffee.mcpserver.dto.OrderResponse;

@Component
public class OrderTools {

    private final RestClient restClient;

    public OrderTools() {
        this.restClient = RestClient.create("http://core-service:8082");
    }

    @Tool(description = "Get the current user's own order history, including status and items for each order")
    public List<OrderResponse> getMyOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("You must be logged in to view your orders.");
        }

        String rawToken = (String) authentication.getCredentials();

        return restClient.get()
                .uri("/api/orders/me")
                .header("Authorization", "Bearer " + rawToken)
                .retrieve()
                .body(new ParameterizedTypeReference<List<OrderResponse>>() {});
    }
}