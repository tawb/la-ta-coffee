package com.latacoffee.core_service.reservation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserEmail(String userEmail);
}