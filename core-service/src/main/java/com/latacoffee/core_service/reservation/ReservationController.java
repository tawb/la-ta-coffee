package com.latacoffee.core_service.reservation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<ReservationResponse> allReservations(
            @PageableDefault(size = 20, sort = "id", direction = Direction.DESC) Pageable pageable
    ) {
        return reservationRepository.findAll(pageable).map(this::toResponse);
    }
    @PutMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservationResponse> updateStatus(@PathVariable Long id, @RequestBody ReservationStatusUpdateRequest request) {
        ReservationStatus newStatus;
        try {
            newStatus = ReservationStatus.valueOf(request.status());
        } catch (IllegalArgumentException e) {
            throw new InvalidReservationStatusException(request.status());
        }

        return reservationRepository.findById(id)
                .map(reservation -> {
                    reservation.setStatus(newStatus);
                    reservationRepository.save(reservation);
                    return ResponseEntity.ok(toResponse(reservation));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}