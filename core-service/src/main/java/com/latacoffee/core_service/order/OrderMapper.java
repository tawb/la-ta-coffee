package com.latacoffee.core_service.order;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(oi -> new OrderItemResponse(oi.getMenuItem().getName(), oi.getUnitPrice()))
                .collect(Collectors.toList());

        return new OrderResponse(
                String.valueOf(order.getId()), order.getTime(), order.getStatus().name(), order.getTotal(), items
        );
    }
}