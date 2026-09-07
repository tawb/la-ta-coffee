package com.latacoffee.mcpserver.dto;

import java.util.List;

public record MenuCategoryDto(String cat, List<MenuItemDto> items) {
}