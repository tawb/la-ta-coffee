package com.latacoffee.backend.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.latacoffee.backend.auth.EmailAlreadyExistsException;
import com.latacoffee.backend.auth.InvalidCredentialsException;
import com.latacoffee.backend.auth.InvalidResetTokenException;
import com.latacoffee.backend.order.MenuItemNotFoundException;
import com.latacoffee.backend.auth.AccountNotFoundException;
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleEmailExists(EmailAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("EMAIL_EXISTS", ex.getMessage()));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("INVALID_CREDENTIALS", ex.getMessage()));
    }
    @ExceptionHandler(MenuItemNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleMenuItemNotFound(MenuItemNotFoundException ex) {
         return ResponseEntity.status(HttpStatus.BAD_REQUEST)
             .body(new ErrorResponse("MENU_ITEM_NOT_FOUND", ex.getMessage()));
}
    @ExceptionHandler(InvalidResetTokenException.class)
    public ResponseEntity<ErrorResponse> handleInvalidResetToken(InvalidResetTokenException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("INVALID_RESET_TOKEN", ex.getMessage()));
    }
    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleAccountNotFound(AccountNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("ACCOUNT_NOT_FOUND", ex.getMessage()));
    }
        
}