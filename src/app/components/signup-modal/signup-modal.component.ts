import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup-modal.component.html',
  styleUrl: './signup-modal.component.scss'
})
export class SignupModalComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public modalService: ModalService
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^0\d{1,2}[\s-]?\d{3}[\s-]?\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      terms: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) return;
    console.log('Signup:', this.signupForm.value);
    this.modalService.close();
  }
}