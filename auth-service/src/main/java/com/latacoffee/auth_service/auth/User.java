package com.latacoffee.auth_service.auth;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "app_user")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;
    private String phone;
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private Role role = Role.CUSTOMER;

    public User(String name, String phone, String email, String passwordHash) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.passwordHash = passwordHash;
    }
}