package com.latacoffee.mcpserver;

import java.util.List;

public record OrderPreview(String confirmationToken, List<String> items, String time, String name) {
}