import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { MagneticDirective } from '../../directives/magnetic.directive';
@Component({
  selector: 'app-visit',
  standalone: true,
  imports: [RouterLink,MagneticDirective,ScrollRevealDirective ],
  templateUrl: './visit.component.html',
  styleUrl: './visit.component.scss'
})
export class VisitComponent {
  mapsUrl = 'https://www.google.com/maps?q=Al-Tireh+Street,+Ramallah';
}