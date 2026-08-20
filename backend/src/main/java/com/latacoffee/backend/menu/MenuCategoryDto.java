package com.latacoffee.backend.menu;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class MenuCategoryDto {
    private String cat;
    private List<MenuItemDto> items;
}