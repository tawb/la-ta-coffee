package com.latacoffee.backend.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class MenuItemDto {
    private String id;
    private String n;
    private String note;
    private double p;
// the from cleanly converting one object type into another.
//MenuItemDto.from(item)
    public static MenuItemDto from(MenuItem item) {
        return new MenuItemDto(item.getId(), item.getName(), item.getNote(), item.getPrice());
    }
}