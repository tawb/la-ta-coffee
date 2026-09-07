package com.latacoffee.mcpserver;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class MenuTools {

    private final RestClient restClient;

    public MenuTools() {
        this.restClient = RestClient.create("http://core-service:8082");
    }

    @Tool(description = "Get the full coffee shop menu, organized by category, with item names, notes, and prices")
    public String getMenu() {
        return restClient.get()
                .uri("/api/menu")
                .retrieve()
                .body(String.class);
    }
}