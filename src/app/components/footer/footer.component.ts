import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { MagneticDirective } from '../../directives/magnetic.directive';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, RouterLink,MagneticDirective,ScrollRevealDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  email: string = '';
  submitted = false;
  year = new Date().getFullYear();

  onSubscribe(form: NgForm) {
    if (form.invalid) return;
    console.log('Newsletter signup:', this.email);
    this.submitted = true;
    form.resetForm();
  }
}