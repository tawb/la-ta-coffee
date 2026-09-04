package com.latacoffee.auth_service.auth;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Component
public class PasswordResetRateLimiter {

    private final ConcurrentMap<String, Bucket> buckets = new ConcurrentHashMap<>();//concurrent because multiple requests could hit this class simultaneously

    public boolean tryConsume(String email) {
        Bucket bucket = buckets.computeIfAbsent(email, this::newBucket);//if this email already has a bucketngive me the existing one
        return bucket.tryConsume(1);
    }

    private Bucket newBucket(String email) {
        Bandwidth limit = Bandwidth.classic(3, Refill.intervally(3, Duration.ofMinutes(20)));
        return Bucket.builder().addLimit(limit).build();
    }
}