package com.latacoffee.ai_chat_service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.mcp.SyncMcpToolCallbackProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.latacoffee.ai_chat_service.security.JwtService;

import io.modelcontextprotocol.client.McpSyncClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatClient.Builder chatClientBuilder;
    private final McpClientFactory mcpClientFactory;
    private final JwtService jwtService;
    private static final Logger log = LoggerFactory.getLogger(ChatController.class);

    public ChatController(ChatClient.Builder chatClientBuilder, McpClientFactory mcpClientFactory, JwtService jwtService) {
        this.chatClientBuilder = chatClientBuilder;
        this.mcpClientFactory = mcpClientFactory;
        this.jwtService = jwtService;
    }

    @PostMapping
    public ResponseEntity<String> chat(
            @RequestBody ChatRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must be logged in to chat.");
        }

        String rawToken = authHeader.substring(7);

        if (!jwtService.isTokenValid(rawToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        try {
            McpSyncClient mcpClient = mcpClientFactory.createClientForUser(rawToken);

            try {
                SyncMcpToolCallbackProvider toolProvider = new SyncMcpToolCallbackProvider(mcpClient);

                ChatClient chatClient = chatClientBuilder.build();

                String response = chatClient.prompt()
                        .user(request.message())
                        .tools(toolProvider)
                        .call()
                        .content();

                return ResponseEntity.ok(response);
            } finally {
                mcpClient.closeGracefully();
            }
        } catch (McpConnectionException e) {
    log.error("MCP connection failed", e);
    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("Could not connect to backend services. Please try again.");
} catch (Exception e) {
    log.error("Chat request failed", e);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong. Please try again.");
}
    }
}