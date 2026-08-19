import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-account-modal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './account-modal.component.html',
  styleUrl: './account-modal.component.scss'
})
export class AccountModalComponent {
  constructor(public modalService: ModalService) {}
}