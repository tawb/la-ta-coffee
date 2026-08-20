package com.latacoffee.backend.order;

import java.time.LocalTime;
import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class OrderRequest {

    @NotNull
    private LocalTime time;

    private String name;

    @NotEmpty
    private List<String> items;

    private double total; // received but never trusted -> OrderController .
}