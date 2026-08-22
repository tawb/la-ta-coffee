package com.latacoffee.auth_service.auth;

public class InvalidResetTokenException extends RuntimeException {
    public InvalidResetTokenException() {
        super("This reset link is invalid or has expired");
    }
}