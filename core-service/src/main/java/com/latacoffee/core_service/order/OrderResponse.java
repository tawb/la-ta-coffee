package com.latacoffee.core_service.order;

import java.time.LocalTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OrderResponse {
    private String id;
    private LocalTime time;
    private String status;
    private double total;
    private List<OrderItemResponse> items;
}