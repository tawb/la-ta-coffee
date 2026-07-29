import { Component, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { MenuService, MenuItem } from '../../services/menu.service';

@Component({
  selector: 'app-order-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './order-modal.component.html',
  styleUrl: './order-modal.component.scss'
})
export class OrderModalComponent {
  orderForm: FormGroup;
  allItems: MenuItem[];
  timeSlots: string[] = [];
  selectedItems = signal<Set<string>>(new Set());//built in collection like an array, but only stores unique values

  total = computed(() => {
    const selected = this.selectedItems();
    return this.allItems
      .filter(item => selected.has(item.n))
      .reduce((sum, item) => sum + item.p, 0);//.reduce() walks through an array and narrow  it down into one single value. sum is a running accumulator.
  });

  constructor(
    private fb: FormBuilder,
    public modalService: ModalService,
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
      const next = new Set(current);//brand new Set, copying every item from current into it
      //Always building a fresh copy guarantees Angular sees a genuinely new reference and reacts correctly.
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
      ...this.orderForm.value,//spread operator
      items: Array.from(this.selectedItems()),
      total: this.total()
    });
    this.modalService.close();
  }
}