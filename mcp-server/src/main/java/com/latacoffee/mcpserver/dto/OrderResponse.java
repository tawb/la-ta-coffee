package com.latacoffee.mcpserver.dto;

import java.time.LocalTime;
import java.util.List;

public record OrderResponse(String id, LocalTime time, String status, double total, List<OrderItemResponse> items) {
}