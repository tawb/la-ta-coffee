import { Component, signal } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { RouterLink, Router } from '@angular/router';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, MagneticDirective],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  menuOpen = signal(false);

  constructor(
    public modalService: ModalService,
    public authService: AuthService,
    private router: Router
  ) {}

  toggleMenu() {
    this.menuOpen.update(open => !open);
  }

  logout() {
    this.authService.logout();
    this.menuOpen.set(false);
    this.router.navigate(['/']);
  }
}