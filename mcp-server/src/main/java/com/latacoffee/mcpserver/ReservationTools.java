package com.latacoffee.mcpserver;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.latacoffee.mcpserver.dto.ReservationRequest;
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

        if (!(authentication instanceof UsernamePasswordAuthenticationToken)) {
                throw new SecurityException("You must be logged in to view your reservations.");
            }

        String rawToken = (String) authentication.getCredentials();

        return restClient.get()
                .uri("/api/reservations/me")
                .header("Authorization", "Bearer " + rawToken)
                .retrieve()
                .body(new ParameterizedTypeReference<List<ReservationResponse>>() {});
    }
    @Tool(description = """
        Create a new table reservation for the current user. Requires a date, a time, 
        party size (1 to 6 guests), a name, and a phone number. Always confirm the date, 
        time, and party size with the user before calling this tool, since it creates a 
        real reservation.
        """)
    public ReservationResponse createReservation(String date, String time, int party, String name, String phone) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication instanceof UsernamePasswordAuthenticationToken)) {
            throw new SecurityException("You must be logged in to make a reservation.");
        }

        String rawToken = (String) authentication.getCredentials();

        ReservationRequest request = new ReservationRequest(LocalDate.parse(date), LocalTime.parse(time), party, name, phone);

        return restClient.post()
                .uri("/api/reservations")
                .header("Authorization", "Bearer " + rawToken)
                .body(request)
                .retrieve()
                .body(ReservationResponse.class);
    }
}