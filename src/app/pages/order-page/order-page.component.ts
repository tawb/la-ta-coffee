import { Component, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuService, MenuItem } from '../../services/menu.service';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss'
})
export class OrderPageComponent {
  orderForm: FormGroup;
  allItems: MenuItem[];
  timeSlots: string[] = [];
  selectedItems = signal<Set<string>>(new Set());

  total = computed(() => {
    const selected = this.selectedItems();
    return this.allItems
      .filter(item => selected.has(item.n))
      .reduce((sum, item) => sum + item.p, 0);
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private menuService: MenuService
  ) {
    this.allItems = this.menuService.getAllItemsFlat();

    for (let hh = 7; hh <= 18; hh++) {
      for (let mm = 0; mm < 60; mm += 30) {
        const hour = hh < 10 ? '0' + hh : hh;
        const min = mm ? '30' : '00';
        this.timeSlots.push(`${hour}:${min}`);
      }
    }

    this.orderForm = this.fb.group({
      time: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  toggleItem(name: string) {
    this.selectedItems.update(current => {
      const next = new Set(current);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  onSubmit() {
    if (this.orderForm.invalid || this.selectedItems().size === 0) return;
    console.log('Order:', {
      ...this.orderForm.value,
      items: Array.from(this.selectedItems()),
      total: this.total()
    });
    this.router.navigate(['/']);
  }
}