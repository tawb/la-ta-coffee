package com.latacoffee.backend.menu;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @NoArgsConstructor
public class MenuItem {

    @Id
    private String id; //e.g. "espresso-cortado" assigned by me, not generated

    @ManyToOne
    @JoinColumn(name = "category_id")
    private MenuCategory category;

    private String name;
    private String note;
    private double price;

    public MenuItem(String id, MenuCategory category, String name, String note, double price) {
        this.id = id;
        this.category = category;
        this.name = name;
        this.note = note;
        this.price = price;
    }
}