import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-reserve-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reserve-modal.component.html',
  styleUrl: './reserve-modal.component.scss'
})
export class ReserveModalComponent {
  reserveForm: FormGroup;
  timeSlots: string[] = [];
  partySizes = [1, 2, 3, 4, 5, 6];

  constructor(
    private fb: FormBuilder,
    public modalService: ModalService
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
    });
  }

  notInPast(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selected = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today ? null : { pastDate: true };
  }

  onSubmit() {
    if (this.reserveForm.invalid) return;
    console.log('Reservation:', this.reserveForm.value);
    this.modalService.close();
  }
}