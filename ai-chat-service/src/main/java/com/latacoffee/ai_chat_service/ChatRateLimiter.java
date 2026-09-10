package com.latacoffee.ai_chat_service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Component
public class ChatRateLimiter {

    private final ConcurrentMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    public boolean tryConsume(String userEmail) {
        Bucket bucket = buckets.computeIfAbsent(userEmail, this::newBucket);
        return bucket.tryConsume(1);
    }

    private Bucket newBucket(String userEmail) {
        Bandwidth limit = Bandwidth.classic(10, Refill.intervally(10, Duration.ofMinutes(5)));
        return Bucket.builder().addLimit(limit).build();
    }
}