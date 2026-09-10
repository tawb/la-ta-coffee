package com.latacoffee.mcpserver;

import java.time.LocalTime;
import java.util.List;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.latacoffee.mcpserver.dto.OrderRequest;
import com.latacoffee.mcpserver.dto.OrderResponse;

@Component
public class OrderTools {

    private final RestClient restClient;
    private final PendingOrderStore pendingOrderStore;

    public OrderTools(PendingOrderStore pendingOrderStore) {
        this.restClient = RestClient.create("http://core-service:8082");
        this.pendingOrderStore = pendingOrderStore;
    }

    @Tool(description = "Get the current user's own order history, including status and items for each order")
    public List<OrderResponse> getMyOrders() {
        Authentication authentication = requireAuth();
        String rawToken = (String) authentication.getCredentials();

        return restClient.get()
                .uri("/api/orders/me")
                .header("Authorization", "Bearer " + rawToken)
                .retrieve()
                .body(new ParameterizedTypeReference<List<OrderResponse>>() {});
    }

    @Tool(description = """
            Preview a new coffee order for the current user, without actually placing it yet. 
            Requires a list of exact menu item IDs (use getMenu first if you don't already know 
            them), a pickup time in HH:mm 24-hour format (e.g. "14:30"), and optionally a name. 
            Returns the real items, prices, and total for the user to review, plus a confirmation 
            token. You must show this preview to the user and get their explicit confirmation 
            before calling confirmOrder with the token, never call confirmOrder without the user 
            genuinely agreeing to the preview first.
            """)
    public OrderPreview previewOrder(String time, String name, List<String> items) {
        Authentication authentication = requireAuth();
        String userEmail = authentication.getName();

        OrderRequest request = new OrderRequest(LocalTime.parse(time), name, items);
        String token = pendingOrderStore.store(userEmail, request);

        return new OrderPreview(token, items, time, name);
    }

    @Tool(description = """
            Actually place an order that was previously previewed with previewOrder. Requires 
            the exact confirmation token returned by previewOrder. Only call this after the user 
            has explicitly confirmed they want to place the order shown in the preview.
            """)
    public OrderResponse confirmOrder(String confirmationToken) {
        Authentication authentication = requireAuth();
        String userEmail = authentication.getName();
        String rawToken = (String) authentication.getCredentials();

        OrderRequest request = pendingOrderStore.retrieveAndRemove(confirmationToken, userEmail);

        return restClient.post()
                .uri("/api/orders")
                .header("Authorization", "Bearer " + rawToken)
                .body(request)
                .retrieve()
                .body(OrderResponse.class);
    }

    private Authentication requireAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication instanceof UsernamePasswordAuthenticationToken)) {
            throw new SecurityException("You must be logged in to do this.");
        }

        return authentication;
    }
}