import { Component, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MenuService, MenuItem } from '../../services/menu.service';
import { OrderStateService } from '../../services/order-state.service';
import Swal from 'sweetalert2';
import { OrderItemComponent } from '../../components/order-item/order-item.component';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [ReactiveFormsModule,OrderItemComponent],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss'
})
export class OrderPageComponent {
  orderForm: FormGroup;
  allItems = signal<MenuItem[]>([]);
  timeSlots: string[] = [];
  selectedItems = signal<Set<string>>(new Set());
  submitting = false;

total = computed(() => {
  const selected = this.selectedItems();
  return this.allItems()
    .filter(item => selected.has(item.id))
    .reduce((sum, item) => sum + item.p, 0);
});

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private menuService: MenuService,
    private route: ActivatedRoute,
    private orderState: OrderStateService
  ) {
    this.menuService.getMenu().subscribe({
    next: () => {
      this.allItems.set(this.menuService.getAllItemsFlat());
      const preselectId = this.route.snapshot.queryParamMap.get('preselect');
      if (preselectId) {
        this.toggleItem(preselectId);
      }
    },
    error: (err) => {
      console.error('Could not load menu for order:', err);
    }
  });

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

  toggleItem(id: string) {
  this.selectedItems.update(current => {
    const next = new Set(current);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    return next;
  });
}

  onSubmit() {
    if (this.orderForm.invalid || this.selectedItems().size === 0) return;

    this.submitting = true;

    const payload = {
      ...this.orderForm.value,
      items: Array.from(this.selectedItems()),
      total: this.total()
    };

    this.http.post('https://jsonplaceholder.typicode.com/posts', payload).subscribe({
      next: () => {
        this.submitting = false;
        Swal.fire({
          title: 'Order placed!',
          icon: 'success',
          timer: 1400,
          showConfirmButton: false
        });
        const id = this.orderState.createConfirmation();
        this.router.navigate(['/confirmation', id]);
      },
      error: (err) => {
        this.submitting = false;
        console.error('Order failed:', err);
        Swal.fire({
          title: 'Something went wrong',
          text: 'Please try again',
          icon: 'error'
        });
      }
    });
  }
}