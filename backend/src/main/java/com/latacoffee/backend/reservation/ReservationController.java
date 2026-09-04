package com.latacoffee.backend.reservation;

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

import com.latacoffee.backend.auth.User;
import com.latacoffee.backend.auth.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    public ReservationController(ReservationRepository reservationRepository, UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
public ResponseEntity<ReservationResponse> create(
        @Valid @RequestBody ReservationRequest request,
        Authentication authentication
) {
    String email = authentication.getName();
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + email));

    Reservation reservation = new Reservation(
            user, request.getDate(), request.getTime(), request.getParty(), request.getName(), request.getPhone()
    );
    reservationRepository.save(reservation);

    return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(reservation));
}

@GetMapping("/me")
public List<ReservationResponse> myReservations(Authentication authentication) {
    String email = authentication.getName();
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + email));

    return reservationRepository.findByUser(user).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
}

private ReservationResponse toResponse(Reservation r) {
    return new ReservationResponse(
            String.valueOf(r.getId()), r.getDate(), r.getTime(), r.getParty(), r.getStatus().name()
    );
}
}