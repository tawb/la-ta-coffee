import { Component, input, output } from '@angular/core';
import { PricePipe } from '../../pipes/price.pipe';
import { MenuItem } from '../../services/menu.service';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [PricePipe],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss'
})
export class OrderItemComponent {
  item = input.required<MenuItem>();
  selected = input(false);
  toggled = output<string>();

  onToggle() {
    this.toggled.emit(this.item().n);
  }
}