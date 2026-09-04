package com.latacoffee.core_service.menu;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuCategoryRepository categoryRepository;
    private final MenuItemRepository itemRepository;

    public MenuController(MenuCategoryRepository categoryRepository, MenuItemRepository itemRepository) {
        this.categoryRepository = categoryRepository;
        this.itemRepository = itemRepository;
    }

    @GetMapping
    public List<MenuCategoryDto> getMenu() {
        List<MenuCategory> categories = categoryRepository.findAll();
        List<MenuItem> allItems = itemRepository.findAll();

        List<MenuCategoryDto> result = new ArrayList<>();

        for (MenuCategory category : categories) {
            List<MenuItemDto> itemsInThisCategory = new ArrayList<>();

            for (MenuItem item : allItems) {
                if (item.getCategory().getId().equals(category.getId())) {
                    itemsInThisCategory.add(MenuItemDto.from(item));
                }
            }

            result.add(new MenuCategoryDto(category.getName(), itemsInThisCategory));
        }

        return result;
    }

    @GetMapping("/search")
    public List<MenuItemDto> search(@RequestParam String q) {
        return itemRepository.findByNameContainingIgnoreCaseOrNoteContainingIgnoreCase(q, q).stream()
                .map(MenuItemDto::from)
                .collect(Collectors.toList());
    }
}