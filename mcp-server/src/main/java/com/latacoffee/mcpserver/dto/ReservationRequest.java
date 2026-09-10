package com.latacoffee.mcpserver.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservationRequest(LocalDate date, LocalTime time, int party, String name, String phone) {
}