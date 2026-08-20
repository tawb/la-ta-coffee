package com.latacoffee.backend.order;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.latacoffee.backend.auth.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter @Setter @NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalTime time;
    private String name;
    private double total;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)//mappedBy says 
    // "don't create anything new,
    //  just reuse the relationship that already exists 
    // from the other side."

   // tells Hibernate: "if an OrderItem is removed from this list,
   //  delete it from the database entirely 
   // don't leave it dangling."
    private List<OrderItem> items = new ArrayList<>();

    public Order(User user, LocalTime time, String name) {
        this.user = user;
        this.time = time;
        this.name = name;
    }
}