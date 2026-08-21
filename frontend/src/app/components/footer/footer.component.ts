import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  email: string = '';
  submitted = false;
  year = new Date().getFullYear();

  constructor(private http: HttpClient) {}

  // // Real endpoint once a backend exists when i do it :
  // // POST /api/newsletter
  // // Expects: { email }
  // // Returns: { subscribed: true }
  // onSubscribe(form: NgForm) {
  //   if (form.invalid) return;

  //   // this.http.post('/api/newsletter', { email: this.email }).subscribe({
  //   //   next: () => { this.submitted = true; form.resetForm(); },
  //   //   error: (err) => console.error('Newsletter signup failed:', err)
  //   // });

  //   of(null).pipe(delay(400)).subscribe(() => {
  //     this.submitted = true;
  //     form.resetForm();
  //   });
  // }
    // POST /api/newsletter
  // Expects: { email }
  // Returns: { subscribed: true }
  onSubscribe(form: NgForm) {
    if (form.invalid) return;

    this.http.post('/api/newsletter', { email: this.email }).subscribe({
      next: () => {
        this.submitted = true;
        form.resetForm();
      },
      error: (err) => console.error('Newsletter signup failed:', err)
    });
  }
}