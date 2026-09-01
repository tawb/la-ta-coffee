package com.latacoffee.core_service.reservation;

public class InvalidReservationStatusException extends RuntimeException {
    public InvalidReservationStatusException(String status) {
        super("Invalid reservation status: " + status);
    }
}