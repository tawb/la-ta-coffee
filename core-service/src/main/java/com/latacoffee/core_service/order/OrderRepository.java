package com.latacoffee.core_service.order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserEmail(String userEmail);

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o")/////if x is NULL, use 0 instead
    double getTotalRevenue();

    @Query("SELECT COALESCE(AVG(o.total), 0) FROM Order o")
    double getAverageOrderValue();

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countOrdersByStatus();
}