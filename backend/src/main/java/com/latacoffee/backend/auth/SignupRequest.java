package com.latacoffee.backend.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class SignupRequest {
    @NotBlank
    private String name;

    @NotBlank
    @Pattern(regexp = "^0\\d{1,2}[\\s-]?\\d{3}[\\s-]?\\d{4}$")
    private String phone;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 8)
    private String password;
}