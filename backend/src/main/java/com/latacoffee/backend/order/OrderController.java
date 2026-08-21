package com.latacoffee.backend.order;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.latacoffee.backend.auth.User;
import com.latacoffee.backend.auth.UserRepository;
import com.latacoffee.backend.menu.MenuItem;
import com.latacoffee.backend.menu.MenuItemRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;

    public OrderController(OrderRepository orderRepository, UserRepository userRepository,
                            MenuItemRepository menuItemRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @PostMapping
public ResponseEntity<OrderResponse> create(
        @Valid @RequestBody OrderRequest request,
        Authentication authentication
) {
    String email = authentication.getName();
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + email));

    Order order = new Order(user, request.getTime(), request.getName());

    for (String itemId : request.getItems()) {
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new MenuItemNotFoundException(itemId));

        OrderItem orderItem = new OrderItem(order, menuItem, menuItem.getPrice());
        order.getItems().add(orderItem);
    }

    double realTotal = order.getItems().stream()
            .mapToDouble(OrderItem::getUnitPrice)
            .sum();
    order.setTotal(realTotal);

    orderRepository.save(order);

    return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(order));
}

@GetMapping("/me")
public List<OrderResponse> myOrders(Authentication authentication) {
    String email = authentication.getName();
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + email));

    return orderRepository.findByUser(user).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
}

private OrderResponse toResponse(Order order) {
    List<OrderItemResponse> items = order.getItems().stream()
            .map(oi -> new OrderItemResponse(oi.getMenuItem().getName(), oi.getUnitPrice()))
            .collect(Collectors.toList());

    return new OrderResponse(
            String.valueOf(order.getId()), order.getTime(), order.getStatus().name(), order.getTotal(), items
    );
}
}