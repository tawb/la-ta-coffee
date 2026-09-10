package com.latacoffee.mcpserver.dto;

import java.time.LocalTime;
import java.util.List;

public record OrderRequest(LocalTime time, String name, List<String> items) {
}