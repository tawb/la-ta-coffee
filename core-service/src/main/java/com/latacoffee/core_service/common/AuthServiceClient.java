package com.latacoffee.core_service.common;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AuthServiceClient {

    private final RestClient restClient;

    public AuthServiceClient() {
        this.restClient = RestClient.create("http://auth-service:8081");
    }

    @RetryOnFailure(maxAttempts = 3, delayMs = 1000)
    public UserProfileResponse getUserProfile(String email) {
        return restClient.get()
                .uri("/api/users/by-email/{email}", email)
                .retrieve()
                .body(UserProfileResponse.class);
    }
}