import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderStateService {
  private confirmationIds = signal<Set<string>>(new Set());

  createConfirmation(): string {
    const id = Math.random().toString(36).slice(2, 8).toUpperCase();
    this.confirmationIds.update(current => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
    return id;
  }

  isValidConfirmation(id: string): boolean {
    return this.confirmationIds().has(id);
  }

  clear() {
    this.confirmationIds.set(new Set());
  }
}