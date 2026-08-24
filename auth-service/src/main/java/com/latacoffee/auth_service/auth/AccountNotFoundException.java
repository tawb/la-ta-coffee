package com.latacoffee.auth_service.auth;

public class AccountNotFoundException extends RuntimeException {
    public AccountNotFoundException(String email) {
        super("No account found with email " + email);
    }
}