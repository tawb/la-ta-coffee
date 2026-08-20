import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  activeModal = signal<string | null>(null);

  open(id: string) {
  this.activeModal.set(id);
  console.log('Active modal is now:', this.activeModal());
}

  close() {
    this.activeModal.set(null);
    console.log('Modal closed, activeModal is now:', this.activeModal());
  }
}