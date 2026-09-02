package com.latacoffee.backend.order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.latacoffee.backend.auth.User;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}