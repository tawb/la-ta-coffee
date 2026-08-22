package com.latacoffee.core_service.reservation;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class ReservationRequest {

    @NotNull
    @FutureOrPresent
    private LocalDate date;

    @NotNull
    private LocalTime time;

    @Min(1) @Max(6)
    private int party;

    @NotBlank
    private String name;

    @NotBlank
    private String phone;
}