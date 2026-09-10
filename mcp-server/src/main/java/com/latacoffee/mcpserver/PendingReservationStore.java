package com.latacoffee.mcpserver;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import com.latacoffee.mcpserver.dto.ReservationRequest;

@Component
public class PendingReservationStore {

    private record PendingReservation(String userEmail, ReservationRequest request) {}

    private final Map<String, PendingReservation> pending = new ConcurrentHashMap<>();

    public String store(String userEmail, ReservationRequest request) {
        String token = UUID.randomUUID().toString();
        pending.put(token, new PendingReservation(userEmail, request));
        return token;
    }

    public ReservationRequest retrieveAndRemove(String token, String userEmail) {
        PendingReservation reservation = pending.get(token);

        if (reservation == null) {
            throw new IllegalArgumentException("This reservation preview doesn't exist. Please start over.");
        }
        if (!reservation.userEmail().equals(userEmail)) {
            throw new SecurityException("This reservation preview doesn't belong to you.");
        }

        pending.remove(token);
        return reservation.request();
    }
}