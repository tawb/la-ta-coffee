package com.latacoffee.mcpserver;

import java.util.List;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.latacoffee.mcpserver.dto.ReservationResponse;

@Component
public class ReservationTools {

    private final RestClient restClient;

    public ReservationTools() {
        this.restClient = RestClient.create("http://core-service:8082");
    }

    @Tool(description = "Get the current user's own reservations, including date, time, party size, and status")
    public List<ReservationResponse> getMyReservations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("You must be logged in to view your reservations.");
        }

        String rawToken = (String) authentication.getCredentials();

        return restClient.get()
                .uri("/api/reservations/me")
                .header("Authorization", "Bearer " + rawToken)
                .retrieve()
                .body(new ParameterizedTypeReference<List<ReservationResponse>>() {});
    }
}