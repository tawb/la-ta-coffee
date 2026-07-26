import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-reset-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-modal.component.html',
  styleUrl: './reset-modal.component.scss'
})
export class ResetModalComponent {
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public modalService: ModalService
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) return;
    console.log('Reset requested for:', this.resetForm.value.email);
    this.modalService.close();
  }
}