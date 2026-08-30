package com.latacoffee.backend.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getName(), request.getPhone(), request.getEmail(), hashedPassword);
        User saved = userRepository.save(user);

        String token = jwtService.generateToken(saved.getEmail());
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

        String token = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(String.valueOf(user.getId()), user.getEmail(), token));
    }

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
}