import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-modal',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-modal.component.html',
  styleUrl: './reset-modal.component.scss'
})
export class ResetModalComponent {
  resetForm: FormGroup;
  submitting = false;
  submitted = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    public modalService: ModalService,
    private http: HttpClient
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // POST /api/auth/password-reset/request
  // Expects: { email }
  // Returns: 202 on success, 404 if no account with that email
  onSubmit() {
    if (this.resetForm.invalid) return;

    this.submitting = true;
    this.errorMessage = null;

    this.http.post('/api/auth/password-reset/request', { email: this.resetForm.value.email }).subscribe({
      next: () => {
        this.submitting = false;
        this.submitted = true;
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.status === 404
          ? 'No account found with that email.'
          : 'Something went wrong. Please try again.';
      }
    });
  }
}