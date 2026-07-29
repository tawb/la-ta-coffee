import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OrderStateService } from '../../services/order-state.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reserve-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reserve-page.component.html',
  styleUrl: './reserve-page.component.scss'
})
export class ReservePageComponent {
  reserveForm: FormGroup;
  timeSlots: string[] = [];
  partySizes = [1, 2, 3, 4, 5, 6];
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private orderState: OrderStateService
  ) {
    for (let hh = 7; hh <= 18; hh++) {
      for (let mm = 0; mm < 60; mm += 30) {
        const hour = hh < 10 ? '0' + hh : hh;
        const min = mm ? '30' : '00';
        this.timeSlots.push(`${hour}:${min}`);
      }
    }

   this.reserveForm = this.fb.group({
    date: ['', [Validators.required, this.notInPast]],
    time: ['', Validators.required],
    party: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^0\d{1,2}[\s-]?\d{3}[\s-]?\d{4}$/)]]
  }, { validators: this.notInPastDateTime });
  }

  notInPast(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selected = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today ? null : { pastDate: true };
  }
  notInPastDateTime(group: AbstractControl): ValidationErrors | null {
  const date = group.get('date')?.value;
  const time = group.get('time')?.value;
  if (!date || !time) return null;

  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const selected = new Date(year, month - 1, day, hour, minute);

  return selected >= new Date() ? null : { pastDateTime: true };
}

  onSubmit() {
    if (this.reserveForm.invalid) return;

    this.submitting = true;

    this.http.post('https://jsonplaceholder.typicode.com/posts', this.reserveForm.value).subscribe({
      next: () => {
        this.submitting = false;
        Swal.fire({
          title: 'Reservation confirmed!',
          icon: 'success',
          timer: 1400,
          showConfirmButton: false
        });
        const id = this.orderState.createConfirmation();
        this.router.navigate(['/confirmation', id]);
      },
      error: (err) => {
        this.submitting = false;
        console.error('Reservation failed:', err);
        Swal.fire({
          title: 'Something went wrong',
          text: 'Please try again',
          icon: 'error'
        });
      }
    });
  }
}