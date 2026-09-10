package com.latacoffee.mcpserver;

import java.util.List;

public record OrderPreview(String confirmationToken, List<OrderPreviewLine> items, double total, String time, String name) {
}