package com.latacoffee.backend.reservation;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReservationResponse {
    private String id;
    private LocalDate date;
    private LocalTime time;
    private int party;
    private String status;
}