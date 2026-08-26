package com.latacoffee.core_service.reservation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserEmail(String userEmail);

    @Query("SELECT r.status, COUNT(r) FROM Reservation r GROUP BY r.status")
    List<Object[]> countReservationsByStatus();

    @Query("SELECT COALESCE(AVG(r.party), 0) FROM Reservation r")
    double getAveragePartySize();
}