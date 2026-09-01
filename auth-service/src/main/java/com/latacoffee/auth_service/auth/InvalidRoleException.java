package com.latacoffee.auth_service.auth;

public class InvalidRoleException extends RuntimeException {
    public InvalidRoleException(String role) {
        super("Invalid role: " + role);
    }
}