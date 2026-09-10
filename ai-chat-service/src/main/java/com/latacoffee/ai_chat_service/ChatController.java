package com.latacoffee.ai_chat_service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.mcp.SyncMcpToolCallbackProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.modelcontextprotocol.client.McpSyncClient;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);

    private final ChatClient.Builder chatClientBuilder;
    private final McpClientFactory mcpClientFactory;

    public ChatController(ChatClient.Builder chatClientBuilder, McpClientFactory mcpClientFactory) {
        this.chatClientBuilder = chatClientBuilder;
        this.mcpClientFactory = mcpClientFactory;
    }

    @PostMapping
    public ResponseEntity<String> chat(@RequestBody ChatRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication instanceof UsernamePasswordAuthenticationToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must be logged in to chat.");
        }

        String rawToken = (String) authentication.getCredentials();

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