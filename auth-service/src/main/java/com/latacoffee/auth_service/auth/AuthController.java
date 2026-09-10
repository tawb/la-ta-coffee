package com.latacoffee.auth_service.auth;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.latacoffee.auth_service.common.EmailService;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final EmailService emailService;
    private final PasswordResetRateLimiter rateLimiter;
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    public AuthController(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        PasswordResetTokenRepository resetTokenRepository,
        EmailService emailService,
        PasswordResetRateLimiter rateLimiter
) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.resetTokenRepository = resetTokenRepository;
    this.emailService = emailService;
    this.rateLimiter = rateLimiter;
}
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getName(), request.getPhone(), request.getEmail(), hashedPassword);
        User saved = userRepository.save(user);
        try {
            emailService.sendWelcomeEmail(saved.getEmail(), saved.getName());
        } catch (EmailSendException e) {
            log.warn("Welcome email failed to send for {}: {}", saved.getEmail(), e.getMessage());
        }

        String token = jwtService.generateToken(saved.getEmail(), saved.getRole().name());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(String.valueOf(saved.getId()), saved.getEmail(), token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponse(String.valueOf(user.getId()), user.getEmail(), token));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/promote/{email}")
    public ResponseEntity<String> promoteToAdmin(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    user.setRole(Role.ADMIN);
                    userRepository.save(user);
                    return ResponseEntity.ok("Promoted " + email + " to ADMIN");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<Void> requestPasswordReset(@Valid @RequestBody PasswordResetRequestDto request) {
        if (!rateLimiter.tryConsume(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AccountNotFoundException(request.getEmail()));

        String token = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plus(30, ChronoUnit.MINUTES);

        resetTokenRepository.save(new PasswordResetToken(token, user, expiresAt));
        emailService.sendPasswordResetEmail(user.getEmail(), token);

        return ResponseEntity.accepted().build();
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<Void> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmDto request) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(request.getToken())
                .orElseThrow(InvalidResetTokenException::new);

        if (resetToken.getExpiresAt().isBefore(Instant.now())) {
            throw new InvalidResetTokenException();
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetTokenRepository.delete(resetToken);

        return ResponseEntity.ok().build();
    }
}