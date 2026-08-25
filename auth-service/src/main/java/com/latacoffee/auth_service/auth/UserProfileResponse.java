package com.latacoffee.auth_service.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserProfileResponse {
    private String name;
    private String phone;
    private String email;
}