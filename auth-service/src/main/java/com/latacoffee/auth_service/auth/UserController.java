package com.latacoffee.auth_service.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/admin/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserResponse> updateRole(@PathVariable Long id, @RequestBody RoleUpdateRequest request) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setRole(Role.valueOf(request.role()));
                    userRepository.save(user);
                    return ResponseEntity.ok(new AdminUserResponse(
                            String.valueOf(user.getId()), user.getName(), user.getEmail(), user.getPhone(), user.getRole().name()
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}