package com.latacoffee.mcpserver;

import java.time.LocalTime;
import java.util.List;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.latacoffee.mcpserver.dto.OrderRequest;
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
        if (!(authentication instanceof UsernamePasswordAuthenticationToken)) {
                    throw new SecurityException("You must be logged in to view your orders.");
                }
       

        String rawToken = (String) authentication.getCredentials();
                return restClient.get()
                .uri("/api/orders/me")
                .header("Authorization", "Bearer " + rawToken)
                .retrieve()
                .body(new ParameterizedTypeReference<List<OrderResponse>>() {});
    }
    @Tool(description = """
        Create a new coffee order for the current user. Requires a list of menu item IDs 
        (use getMenu first if you don't already know the real, exact item IDs), a pickup time, 
        and optionally a name for the order. Always confirm the specific items, quantities, 
        and pickup time with the user before calling this tool, since it creates a real order.
        """)
    public OrderResponse createOrder(String time, String name, List<String> items) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication instanceof UsernamePasswordAuthenticationToken)) {
            throw new SecurityException("You must be logged in to place an order.");
        }

        String rawToken = (String) authentication.getCredentials();

        OrderRequest request = new OrderRequest(LocalTime.parse(time), name, items);

        return restClient.post()
                .uri("/api/orders")
                .header("Authorization", "Bearer " + rawToken)
                .body(request)
                .retrieve()
                .body(OrderResponse.class);
    }
}