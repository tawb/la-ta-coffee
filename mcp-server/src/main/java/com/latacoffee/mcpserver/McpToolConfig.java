package com.latacoffee.mcpserver;

import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class McpToolConfig {

    @Bean
    public ToolCallbackProvider tools(MenuTools menuTools, OrderTools orderTools, ReservationTools reservationTools) {
        return MethodToolCallbackProvider.builder()
                .toolObjects(menuTools, orderTools, reservationTools)
                .build();
    }
}