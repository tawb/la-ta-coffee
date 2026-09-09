package com.latacoffee.mcpserver.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservationResponse(String id, LocalDate date, LocalTime time, int party, String status) {
}