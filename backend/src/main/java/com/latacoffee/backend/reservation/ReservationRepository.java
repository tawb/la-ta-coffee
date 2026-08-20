package com.latacoffee.backend.reservation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.latacoffee.backend.auth.User;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUser(User user);
}