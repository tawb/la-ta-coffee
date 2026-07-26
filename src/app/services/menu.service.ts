import { Injectable } from '@angular/core';

export interface MenuItem {
  n: string;
  note: string;
  p: number;
}

export interface MenuCategory {
  cat: string;
  items: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menu: MenuCategory[] = [
    { cat: 'Filter', items: [
      { n: 'Yirgacheffe', note: 'Ethiopia · washed · jasmine, bergamot', p: 20 },
      { n: 'Kirinyaga', note: 'Kenya · washed · blackcurrant', p: 22 },
      { n: 'Nariño', note: 'Colombia · honey · red plum', p: 20 }
    ]},
    { cat: 'Espresso', items: [
      { n: 'Espresso', note: 'Single origin, whatever is open', p: 10 },
      { n: 'Cortado', note: 'Equal parts', p: 14 },
      { n: 'Flat White', note: 'Six ounces', p: 16 },
      { n: 'Mocha', note: 'Dark, not sweet', p: 18 }
    ]},
    { cat: 'Cold', items: [
      { n: 'Cold Brew', note: 'Eighteen hours', p: 20 },
      { n: 'Iced Latte', note: 'Six ounces, over ice', p: 18 }
    ]},
    { cat: 'Matcha', items: [
      { n: 'Matcha Latte', note: 'Ceremonial grade, Uji', p: 22 },
      { n: 'Chocolate Matcha', note: 'Layered, not stirred', p: 24 },
      { n: 'Matcha Strawberry', note: 'Seasonal', p: 24 },
      { n: 'Taro Matcha', note: 'Root and leaf', p: 24 },
      { n: 'Banana Matcha', note: 'Blended cold', p: 24 },
      { n: 'Caramel Matcha', note: 'Salted', p: 24 },
      { n: 'Mango Matcha', note: 'Cold only', p: 24 }
    ]}
  ];

  getMenu(): MenuCategory[] {
    return this.menu;
  }

  getAllItemsFlat(): MenuItem[] {
    return this.menu.flatMap(category => category.items);//One single, flat list of every item across every category
  }
}