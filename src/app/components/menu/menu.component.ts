import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService, MenuCategory } from '../../services/menu.service';
import { MenuItemComponent } from '../menu-item/menu-item.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenuItemComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  categories: MenuCategory[] = [];

  constructor(
    public menuService: MenuService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMenu();
  }

  loadMenu() {
    this.menuService.getMenu().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Could not load menu:', err);
      }
    });
  }

  retryLoad() {
    this.loadMenu();
  }

  onItemOrdered(id: string) {
    this.router.navigate(['/order'], { queryParams: { preselect: id } });
  }
}