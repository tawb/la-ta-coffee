package com.latacoffee.backend.newsletter;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class NewsletterRequest {
    @NotBlank @Email
    private String email;
}