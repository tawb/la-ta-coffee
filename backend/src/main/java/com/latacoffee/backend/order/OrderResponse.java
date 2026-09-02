package com.latacoffee.backend.order;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OrderResponse {
    private String id;
    private Instant confirmedAt;
}