import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account-modal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './account-modal.component.html',
  styleUrl: './account-modal.component.scss'
})
export class AccountModalComponent {
  constructor(
    public modalService: ModalService,
    public authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.modalService.close();
    this.router.navigate(['/']);
  }
}