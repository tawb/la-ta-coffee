package com.latacoffee.core_service.order;

import com.latacoffee.core_service.menu.MenuItem;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

    private double unitPrice; // snapshot of the price at order time

    public OrderItem(Order order, MenuItem menuItem, double unitPrice) {
        this.order = order;
        this.menuItem = menuItem;
        this.unitPrice = unitPrice;
    }
}