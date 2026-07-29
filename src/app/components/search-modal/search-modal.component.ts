import { Component, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { MenuService, MenuItem } from '../../services/menu.service';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-modal.component.html',
  styleUrl: './search-modal.component.scss'
})
export class SearchModalComponent {
  searchControl = new FormControl('');//a FormGroup is a collection of FormControls
  query = signal('');
  allItems: MenuItem[];

  filteredItems = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return [];
    return this.allItems.filter(item =>
      item.n.toLowerCase().includes(q) || item.note.toLowerCase().includes(q)
    );
  });

  constructor(
    public modalService: ModalService,
    private menuService: MenuService
  ) {
    //form input changes (Observable) → update our signal, so computed() can react to it
    this.allItems = this.menuService.getAllItemsFlat();
    //when the value changes an this comes from the form control 
    this.searchControl.valueChanges.subscribe(value => {
      this.query.set(value ?? '');//value or null
    });
  }
}