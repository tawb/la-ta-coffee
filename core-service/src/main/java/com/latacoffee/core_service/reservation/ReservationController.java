package com.latacoffee.core_service.reservation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationRepository reservationRepository;

    public ReservationController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> create(
            @Valid @RequestBody ReservationRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        Reservation reservation = new Reservation(
                userEmail, request.getDate(), request.getTime(), request.getParty(), request.getName(), request.getPhone()
        );
        reservationRepository.save(reservation);

        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(reservation));
    }

    @GetMapping("/me")
    public List<ReservationResponse> myReservations(Authentication authentication) {
        String userEmail = authentication.getName();

        return reservationRepository.findByUserEmail(userEmail).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ReservationResponse toResponse(Reservation r) {
        return new ReservationResponse(
                String.valueOf(r.getId()), r.getDate(), r.getTime(), r.getParty(), r.getStatus().name()
        );
    }
}