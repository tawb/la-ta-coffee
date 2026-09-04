package com.latacoffee.auth_service.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final String internalApiSecret;

    public UserController(UserRepository userRepository, @Value("${internal.api.secret}") String internalApiSecret) {
        this.userRepository = userRepository;
        this.internalApiSecret = internalApiSecret;
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<UserProfileResponse> getByEmail(
            @PathVariable String email,
            @RequestHeader(value = "X-Internal-Secret", required = false) String providedSecret
    ) {
        if (providedSecret == null || !providedSecret.equals(internalApiSecret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(new UserProfileResponse(user.getName(), user.getPhone(), user.getEmail())))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<AdminUserResponse> allUsers(
            @PageableDefault(size = 20, sort = "id", direction = Direction.DESC) Pageable pageable
    ) {
        return userRepository.findAll(pageable)
                .map(user -> new AdminUserResponse(
                        String.valueOf(user.getId()), user.getName(), user.getEmail(), user.getPhone(), user.getRole().name()
                ));
    }
}