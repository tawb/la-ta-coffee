package com.latacoffee.core_service.order;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.latacoffee.core_service.common.AuthServiceClient;
import com.latacoffee.core_service.common.UserProfileResponse;
import com.latacoffee.core_service.config.RabbitMQConfig;
import com.latacoffee.core_service.menu.MenuItem;
import com.latacoffee.core_service.menu.MenuItemRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final AuthServiceClient authServiceClient;
    private final RabbitTemplate rabbitTemplate;

    public OrderController(OrderRepository orderRepository, MenuItemRepository menuItemRepository,
                            AuthServiceClient authServiceClient, RabbitTemplate rabbitTemplate) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.authServiceClient = authServiceClient;
        this.rabbitTemplate = rabbitTemplate;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(
            @Valid @RequestBody OrderRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        // Real synchronous cross-service call 
        // needs the customer's real name before it can proceed correctly.
        UserProfileResponse profile = authServiceClient.getUserProfile(userEmail);

        Order order = new Order(userEmail, request.getTime(), profile.name());

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

        // Async the order has already succeeded; the notification is a
        // side effect that doesn't need to have happened before we respond
        //so we use queueing
        OrderCreatedMessage message = new OrderCreatedMessage(
                userEmail, profile.name(), String.valueOf(order.getId()), realTotal
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.ORDER_QUEUE, message);

        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(order));
    }

    @GetMapping("/me")
    public List<OrderResponse> myOrders(Authentication authentication) {
        String userEmail = authentication.getName();

        return orderRepository.findByUserEmail(userEmail).stream()
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