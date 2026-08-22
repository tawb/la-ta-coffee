import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss'
})
export class ResetPasswordPageComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  submitting = false;
  submitted = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  // POST /api/auth/password-reset/confirm
  // Expects: { token, newPassword }
  // Returns: 200 on success, 400 if token is invalid/expired
  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    this.submitting = true;
    this.errorMessage = null;

    const payload = {
      token: this.token,
      newPassword: this.resetForm.value.newPassword
    };

    this.http.post('/api/auth/password-reset/confirm', payload).subscribe({
      next: () => {
        this.submitting = false;
        this.submitted = true;
      },
      error: () => {
        this.submitting = false;
        this.errorMessage = 'This reset link is invalid or has expired. Please request a new one.';
      }
    });
  }
}