import { Component } from '@angular/core';

interface GalleryCup {
  name: string;
  note: string;
  slot: number;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  cups: GalleryCup[] = [
    { name: 'Cold Brew', note: 'Eighteen hours', slot: 0 },
    { name: 'Iced Latte', note: 'Six ounces', slot: 1 },
    { name: 'Mocha', note: 'Dark, not sweet', slot: 2 },
    { name: 'Matcha Latte', note: 'Ceremonial grade', slot: 3 },
    { name: 'Chocolate Matcha', note: 'Layered', slot: 4 },
    { name: 'Matcha Strawberry', note: 'Seasonal', slot: 5 },
    { name: 'Taro Matcha', note: 'Root and leaf', slot: 6 },
    { name: 'Banana Matcha', note: 'Blended', slot: 7 },
    { name: 'Caramel Matcha', note: 'Salted', slot: 8 },
    { name: 'Mango Matcha', note: 'Cold only', slot: 9 }
  ];

  slotPosition(slot: number): string {
    return (slot / 9) * 100 + '%';
  }
}