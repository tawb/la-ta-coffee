package com.latacoffee.core_service.newsletter;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    private final NewsletterRepository newsletterRepository;

    public NewsletterController(NewsletterRepository newsletterRepository) {
        this.newsletterRepository = newsletterRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, Boolean>> subscribe(@Valid @RequestBody NewsletterRequest request) {
        if (!newsletterRepository.existsByEmail(request.getEmail())) {
            newsletterRepository.save(new NewsletterSubscriber(request.getEmail()));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("subscribed", true));
    }
}