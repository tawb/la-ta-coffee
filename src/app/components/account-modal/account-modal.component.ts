import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-account-modal',
  standalone: true,
  imports: [],
  templateUrl: './account-modal.component.html',
  styleUrl: './account-modal.component.scss'
})
export class AccountModalComponent {
  constructor(public modalService: ModalService) {}
}