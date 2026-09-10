package com.latacoffee.mcpserver;

import java.util.List;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.core.ParameterizedTypeReference;
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
        return restClient.get()
                .uri("/api/orders/me")
                .retrieve()
                .body(new ParameterizedTypeReference<List<OrderResponse>>() {});
    }
}