package com.latacoffee.ai_chat_service;

import java.time.Duration;

import org.springframework.stereotype.Component;

import io.modelcontextprotocol.client.McpClient;
import io.modelcontextprotocol.client.McpSyncClient;
import io.modelcontextprotocol.client.transport.HttpClientStreamableHttpTransport;

@Component
public class McpClientFactory {

    public McpSyncClient createClientForUser(String rawJwt) {
        HttpClientStreamableHttpTransport transport = HttpClientStreamableHttpTransport
                .builder("http://mcp-server:8084")
                .httpRequestCustomizer((requestBuilder, method, uri, body, context) ->
                        requestBuilder.setHeader("Authorization", "Bearer " + rawJwt)
                )
                .build();

        McpSyncClient client = McpClient.sync(transport)
                .requestTimeout(Duration.ofSeconds(10))
                .build();

        try {
            client.initialize();
        } catch (Exception e) {
            client.closeGracefully();
            throw new McpConnectionException("Failed to connect to mcp-server", e);
        }

        return client;
    }
}