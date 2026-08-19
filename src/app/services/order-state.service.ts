import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderStateService {
  lastConfirmationId = signal<string | null>(null);

  createConfirmation(): string {
    const id = Math.random().toString(36).slice(2, 8).toUpperCase();
    this.lastConfirmationId.set(id);
    return id;
  }

  isValidConfirmation(id: string): boolean {
    return this.lastConfirmationId() === id;
  }

  clear() {
    this.lastConfirmationId.set(null);
  }
}