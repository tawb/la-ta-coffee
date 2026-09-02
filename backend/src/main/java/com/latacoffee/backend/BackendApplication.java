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
			if (categoryRepo.count() > 0) {
				return; // already seeded, don't insert again
			}

			MenuCategory filter = categoryRepo.save(new MenuCategory("Filter"));
			itemRepo.save(new MenuItem("filter-yirgacheffe", filter, "Yirgacheffe", "Ethiopia · washed · jasmine, bergamot", 20));
			itemRepo.save(new MenuItem("filter-kirinyaga", filter, "Kirinyaga", "Kenya · washed · blackcurrant", 22));
			itemRepo.save(new MenuItem("filter-narino", filter, "Nariño", "Colombia · honey · red plum", 20));

			MenuCategory espresso = categoryRepo.save(new MenuCategory("Espresso"));
			itemRepo.save(new MenuItem("espresso-espresso", espresso, "Espresso", "Single origin, whatever is open", 10));
			itemRepo.save(new MenuItem("espresso-cortado", espresso, "Cortado", "Equal parts", 14));
			itemRepo.save(new MenuItem("espresso-flat-white", espresso, "Flat White", "Six ounces", 16));
			itemRepo.save(new MenuItem("espresso-mocha", espresso, "Mocha", "Dark, not sweet", 18));
			itemRepo.save(new MenuItem("asem-vip", espresso, "The power Asem", "Made with the best profitional barista asem", 41));
			itemRepo.save(new MenuItem("matari-vip", espresso, "Matari The rain", "Made with the best profitional barista halima", 42));

			MenuCategory cold = categoryRepo.save(new MenuCategory("Cold"));
			itemRepo.save(new MenuItem("cold-brew", cold, "Cold Brew", "Eighteen hours", 20));
			itemRepo.save(new MenuItem("cold-iced-latte", cold, "Iced Latte", "Six ounces, over ice", 18));
			itemRepo.save(new MenuItem("ahmad", cold, "Abu Awwad", "200 OK", 10000));

			MenuCategory matcha = categoryRepo.save(new MenuCategory("Matcha"));
			itemRepo.save(new MenuItem("matcha-latte", matcha, "Matcha Latte", "Ceremonial grade, Uji", 22));
			itemRepo.save(new MenuItem("matcha-chocolate", matcha, "Chocolate Matcha", "Layered, not stirred", 24));
			itemRepo.save(new MenuItem("matcha-strawberry", matcha, "Matcha Strawberry", "Seasonal", 24));
			itemRepo.save(new MenuItem("matcha-taro", matcha, "Taro Matcha", "Root and leaf", 24));
			itemRepo.save(new MenuItem("matcha-banana", matcha, "Banana Matcha", "Blended cold", 24));
			itemRepo.save(new MenuItem("matcha-caramel", matcha, "Caramel Matcha", "Salted", 24));
			itemRepo.save(new MenuItem("matcha-mango", matcha, "Mango Matcha", "Cold only", 24));
		};
}
}


