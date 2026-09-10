package com.latacoffee.mcpserver;

public record ReservationPreview(String confirmationToken, String date, String time, int party, String name, String phone) {
}