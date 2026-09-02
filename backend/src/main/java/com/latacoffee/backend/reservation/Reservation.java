package com.latacoffee.backend.reservation;

import com.latacoffee.backend.auth.User;
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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDate date;
    private LocalTime time;
    private int party;
    private String name;
    private String phone;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status = ReservationStatus.PENDING;

    public Reservation(User user, LocalDate date, LocalTime time, int party, String name, String phone) {
        this.user = user;
        this.date = date;
        this.time = time;
        this.party = party;
        this.name = name;
        this.phone = phone;
    }
}