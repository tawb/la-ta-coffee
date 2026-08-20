import { Component, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { MenuService, MenuItem } from '../../services/menu.service';
import { PricePipe } from '../../pipes/price.pipe';
@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [ReactiveFormsModule,PricePipe],
  templateUrl: './search-modal.component.html',
  styleUrl: './search-modal.component.scss'
})
export class SearchModalComponent {
  searchControl = new FormControl('');
  query = signal('');
  allItems: MenuItem[] = [];

  filteredItems = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return [];
    return this.allItems.filter(item =>
      item.n.toLowerCase().includes(q) || item.note.toLowerCase().includes(q)
    );
  });

  constructor(
    public modalService: ModalService,
    public menuService: MenuService
  ) {
    this.loadMenu();

    this.searchControl.valueChanges.subscribe(value => {
      this.query.set(value ?? '');
    });
  }

  loadMenu() {
    this.menuService.getMenu().subscribe({
      next: () => {
        this.allItems = this.menuService.getAllItemsFlat();
      },
      error: (err) => {
        console.error('Could not load menu for search:', err);
      }
    });
  }

  retryLoad() {
    this.loadMenu();
  }
}