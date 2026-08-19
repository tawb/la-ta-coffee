import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-confirmation-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './confirmation-page.component.html',
  styleUrl: './confirmation-page.component.scss'
})
export class ConfirmationPageComponent {
  confirmationId: string | null;

  constructor(private route: ActivatedRoute) {
    this.confirmationId = this.route.snapshot.paramMap.get('id');
  }
}