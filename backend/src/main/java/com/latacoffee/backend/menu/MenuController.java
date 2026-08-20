package com.latacoffee.backend.menu;

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
        return categoryRepository.findAll().stream()
                .map(category -> new MenuCategoryDto(
                        category.getName(),
                        itemRepository.findAll().stream()
                                .filter(item -> item.getCategory().getId().equals(category.getId()))
                                .map(MenuItemDto::from)
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/search")
    public List<MenuItemDto> search(@RequestParam String q) {
        return itemRepository.findByNameContainingIgnoreCaseOrNoteContainingIgnoreCase(q, q).stream()
                .map(MenuItemDto::from)
                .collect(Collectors.toList());
    }
}