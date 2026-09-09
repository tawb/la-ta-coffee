package com.latacoffee.mcpserver;

import java.util.List;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.latacoffee.mcpserver.dto.MenuCategoryDto;

@Component
public class MenuTools {

    private final RestClient restClient;

    public MenuTools() {
        this.restClient = RestClient.create("http://core-service:8082");
    }

    @Tool(description = "Get the full coffee shop menu, organized by category, with item names, notes, and prices")
    public List<MenuCategoryDto> getMenu() {
        return restClient.get()
                .uri("/api/menu")
                .retrieve()
                .body(new org.springframework.core.ParameterizedTypeReference<List<MenuCategoryDto>>() {});
    }
}