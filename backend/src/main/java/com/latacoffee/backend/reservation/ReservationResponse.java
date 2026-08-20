package com.latacoffee.backend.reservation;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReservationResponse {
    private String id;
    private Instant confirmedAt;
}