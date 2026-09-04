package com.latacoffee.backend.menu;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
//A DTO is a small class that defines exactly what my API sends or receives,
//  kept separate from my entity 
// so my database structure can stay clean and sensible, 
// while my API's JSON shape can be whatever the frontend actually needs,
//  even if that's different (like n instead of name).
@Getter @AllArgsConstructor
public class MenuCategoryDto {
    private String cat;
    private List<MenuItemDto> items;
}