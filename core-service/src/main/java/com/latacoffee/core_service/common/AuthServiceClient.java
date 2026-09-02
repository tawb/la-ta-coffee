package com.latacoffee.core_service.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AuthServiceClient {

    private final RestClient restClient;
    private final String internalApiSecret;

    public AuthServiceClient(@Value("${internal.api.secret}") String internalApiSecret) {
        this.internalApiSecret = internalApiSecret;
        this.restClient = RestClient.create("http://auth-service:8081");
    }

    @RetryOnFailure(maxAttempts = 3, delayMs = 1000)
    public UserProfileResponse getUserProfile(String email) {
        return restClient.get()
                .uri("/api/users/by-email/{email}", email)
                .header("X-Internal-Secret", internalApiSecret)
                .retrieve()
                .body(UserProfileResponse.class);
    }
}