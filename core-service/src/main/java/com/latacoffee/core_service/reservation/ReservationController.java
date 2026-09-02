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
    private final ReservationMapper mapper;

    public ReservationController(ReservationRepository reservationRepository, ReservationMapper mapper) {
        this.reservationRepository = reservationRepository;
        this.mapper = mapper;
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

        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toResponse(reservation));
    }

    @GetMapping("/me")
    public List<ReservationResponse> myReservations(Authentication authentication) {
        String userEmail = authentication.getName();

        return reservationRepository.findByUserEmail(userEmail).stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<ReservationResponse> allReservations(
            @PageableDefault(size = 20, sort = "id", direction = Direction.DESC) Pageable pageable
    ) {
        return reservationRepository.findAll(pageable).map(mapper::toResponse);
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
                    return ResponseEntity.ok(mapper.toResponse(reservation));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ReservationResponse> cancel(@PathVariable Long id, Authentication authentication) {
        return reservationRepository.findById(id)
                .map(reservation -> {
                    if (!reservation.getUserEmail().equals(authentication.getName())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).<ReservationResponse>build();
                    }
                    if (reservation.getStatus() != ReservationStatus.PENDING) {
                        return ResponseEntity.status(HttpStatus.CONFLICT).<ReservationResponse>build();
                    }
                    reservation.setStatus(ReservationStatus.CANCELLED);
                    reservationRepository.save(reservation);
                    return ResponseEntity.ok(mapper.toResponse(reservation));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}