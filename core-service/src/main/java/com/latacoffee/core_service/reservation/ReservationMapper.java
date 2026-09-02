package com.latacoffee.core_service.reservation;

import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {

    public ReservationResponse toResponse(Reservation reservation) {
        return new ReservationResponse(
                String.valueOf(reservation.getId()),
                reservation.getDate(),
                reservation.getTime(),
                reservation.getParty(),
                reservation.getStatus().name()
        );
    }
}