package com.latacoffee.core_service.order;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.latacoffee.core_service.common.AdminStatsResponse;
import com.latacoffee.core_service.common.AuthServiceClient;
import com.latacoffee.core_service.common.UserProfileResponse;
import com.latacoffee.core_service.config.RabbitMQConfig;
import com.latacoffee.core_service.menu.MenuItem;
import com.latacoffee.core_service.menu.MenuItemRepository;
import com.latacoffee.core_service.reservation.ReservationRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final AuthServiceClient authServiceClient;
    private final RabbitTemplate rabbitTemplate;
    private final ReservationRepository reservationRepository;
    

    public OrderController(OrderRepository orderRepository, MenuItemRepository menuItemRepository,
                            AuthServiceClient authServiceClient, RabbitTemplate rabbitTemplate,ReservationRepository reservationRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.authServiceClient = authServiceClient;
        this.rabbitTemplate = rabbitTemplate;
        this.reservationRepository = reservationRepository;

    }
    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminStatsResponse stats() {
        Map<String, Long> ordersByStatus = new HashMap<>();
        for (Object[] row : orderRepository.countOrdersByStatus()) {
                ordersByStatus.put(row[0].toString(), (Long) row[1]);
                        }
        Map<String, Long> reservationsByStatus = new HashMap<>();
        for (Object[] row : reservationRepository.countReservationsByStatus()) {
                reservationsByStatus.put(row[0].toString(), (Long) row[1]);
        }

        return new AdminStatsResponse(
                orderRepository.getTotalRevenue(),
                orderRepository.getAverageOrderValue(),
                ordersByStatus,
                reservationRepository.getAveragePartySize(),
                reservationsByStatus
        );
        }
        @PutMapping("/admin/{id}/status")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<OrderResponse> updateStatus(@PathVariable Long id, @RequestBody OrderStatusUpdateRequest request) {
        OrderStatus newStatus;
        try {
                newStatus = OrderStatus.valueOf(request.status());
        } catch (IllegalArgumentException e) {
                throw new InvalidOrderStatusException(request.status());
        }

        return orderRepository.findById(id)
                .map(order -> {
                        order.setStatus(newStatus);
                        orderRepository.save(order);
                        return ResponseEntity.ok(toResponse(order));
                })
                .orElse(ResponseEntity.notFound().build());
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
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
     public Page<OrderResponse> allOrders(
                @PageableDefault(size = 20, sort = "id", direction = Direction.DESC) Pageable pageable
        ) {
        return orderRepository.findAll(pageable).map(this::toResponse);
        }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(oi -> new OrderItemResponse(oi.getMenuItem().getName(), oi.getUnitPrice()))
                .collect(Collectors.toList());

        return new OrderResponse(
                String.valueOf(order.getId()), order.getTime(), order.getStatus().name(), order.getTotal(), items
        );
    }
    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancel(@PathVariable Long id, Authentication authentication) {
        return orderRepository.findById(id)
                .map(order -> {
                        if (!order.getUserEmail().equals(authentication.getName())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).<OrderResponse>build();
                        }
                        if (order.getStatus() != OrderStatus.PENDING) {
                        return ResponseEntity.status(HttpStatus.CONFLICT).<OrderResponse>build();
                        }
                        order.setStatus(OrderStatus.CANCELLED);
                        orderRepository.save(order);
                        return ResponseEntity.ok(toResponse(order));
                })
                .orElse(ResponseEntity.notFound().build());
        }
}