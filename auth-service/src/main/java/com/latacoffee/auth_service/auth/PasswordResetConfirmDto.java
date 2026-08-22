package com.latacoffee.auth_service.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class PasswordResetConfirmDto {
    @NotBlank
    private String token;

    @NotBlank @Size(min = 8)
    private String newPassword;
}