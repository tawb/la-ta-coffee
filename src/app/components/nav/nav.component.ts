import { Component, signal } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  menuOpen = signal(false);

  constructor(public modalService: ModalService) {}

  toggleMenu() {
    this.menuOpen.update(open => !open);
  }
}