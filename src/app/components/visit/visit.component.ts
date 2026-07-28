import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-visit',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './visit.component.html',
  styleUrl: './visit.component.scss'
})
export class VisitComponent {
  mapsUrl = 'https://www.google.com/maps?q=Al-Tireh+Street,+Ramallah';
}