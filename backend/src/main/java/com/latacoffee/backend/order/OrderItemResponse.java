package com.latacoffee.backend.order;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OrderItemResponse {
    private String name;
    private double unitPrice;
}