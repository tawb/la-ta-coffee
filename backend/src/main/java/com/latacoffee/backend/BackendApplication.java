package com.latacoffee.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.latacoffee.backend.menu.MenuCategory;
import com.latacoffee.backend.menu.MenuCategoryRepository;
import com.latacoffee.backend.menu.MenuItem;
import com.latacoffee.backend.menu.MenuItemRepository;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
	@Bean
	CommandLineRunner seedMenu(MenuCategoryRepository categoryRepo, MenuItemRepository itemRepo) {
    	return args -> {
			MenuCategory espresso = categoryRepo.save(new MenuCategory("Espresso"));
			MenuCategory matcha = categoryRepo.save(new MenuCategory("Matcha"));

			itemRepo.save(new MenuItem("espresso-cortado", espresso, "Cortado", "Equal parts", 14.0));
			itemRepo.save(new MenuItem("espresso-flat-white", espresso, "Flat White", "Double shot, silky milk", 16.0));
			itemRepo.save(new MenuItem("matcha-latte", matcha, "Matcha Latte", "Ceremonial grade, Uji", 22.0));
		};
}

}
