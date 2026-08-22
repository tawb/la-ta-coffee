package com.latacoffee.auth_service.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String id;
    private String email;
    private String token;
}