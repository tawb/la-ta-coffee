package com.latacoffee.auth_service.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminUserResponse {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String role;
}