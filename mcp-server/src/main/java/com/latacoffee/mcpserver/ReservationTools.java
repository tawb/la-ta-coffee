package com.latacoffee.mcpserver;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.latacoffee.mcpserver.dto.ReservationRequest;
import com.latacoffee.mcpserver.dto.ReservationResponse;

@Component
public class ReservationTools {

    private final RestClient restClient;
    private final PendingReservationStore pendingReservationStore;

    public ReservationTools(PendingReservationStore pendingReservationStore) {
        this.restClient = RestClient.create("http://core-service:8082");
        this.pendingReservationStore = pendingReservationStore;
    }

    @Tool(description = "Get the current user's own reservations, including date, time, party size, and status")
    public List<ReservationResponse> getMyReservations() {
        Authentication authentication = requireAuth();
        String rawToken = (String) authentication.getCredentials();

        return restClient.get()
                .uri("/api/reservations/me")
                .header("Authorization", "Bearer " + rawToken)
                .retrieve()
                .body(new ParameterizedTypeReference<List<ReservationResponse>>() {});
    }

    @Tool(description = """
            Preview a new table reservation for the current user, without actually creating it 
            yet. Requires a date in YYYY-MM-DD format, a time in HH:mm 24-hour format, party 
            size (1 to 6 guests), a name, and a phone number. Returns the details for the user 
            to review, plus a confirmation token. You must show this preview to the user and get 
            their explicit confirmation before calling confirmReservation with the token, never 
            call confirmReservation without the user genuinely agreeing to the preview first.
            """)
    public ReservationPreview previewReservation(String date, String time, int party, String name, String phone) {
        Authentication authentication = requireAuth();
        String userEmail = authentication.getName();

        ReservationRequest request = new ReservationRequest(LocalDate.parse(date), LocalTime.parse(time), party, name, phone);
        String token = pendingReservationStore.store(userEmail, request);

        return new ReservationPreview(token, date, time, party, name, phone);
    }

    @Tool(description = """
            Actually create a reservation that was previously previewed with previewReservation. 
            Requires the exact confirmation token returned by previewReservation. Only call this 
            after the user has explicitly confirmed the reservation shown in the preview.
            """)
    public ReservationResponse confirmReservation(String confirmationToken) {
        Authentication authentication = requireAuth();
        String userEmail = authentication.getName();
        String rawToken = (String) authentication.getCredentials();

        ReservationRequest request = pendingReservationStore.retrieveAndRemove(confirmationToken, userEmail);

        return restClient.post()
                .uri("/api/reservations")
                .header("Authorization", "Bearer " + rawToken)
                .body(request)
                .retrieve()
                .body(ReservationResponse.class);
    }

    private Authentication requireAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication instanceof UsernamePasswordAuthenticationToken)) {
            throw new SecurityException("You must be logged in to do this.");
        }

        return authentication;
    }
}