package com.latacoffee.core_service.reservation;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter @Setter @NoArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    private LocalDate date;
    private LocalTime time;
    private int party;
    private String name;
    private String phone;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status = ReservationStatus.PENDING;

    public Reservation(String userEmail, LocalDate date, LocalTime time, int party, String name, String phone) {
        this.userEmail = userEmail;
        this.date = date;
        this.time = time;
        this.party = party;
        this.name = name;
        this.phone = phone;
    }
}