import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PricePipe } from '../../pipes/price.pipe';
import { MenuItem } from '../../services/menu.service';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [PricePipe],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
  @Input() item!: MenuItem;//The ! is the non-null assertion operator
  @Output() ordered = new EventEmitter<string>();

  onOrder() {
    this.ordered.emit(this.item.n);
  }
}