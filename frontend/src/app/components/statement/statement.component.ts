import { Component, ElementRef, HostListener, inject, signal, computed } from '@angular/core';

@Component({
  selector: 'app-statement',
  standalone: true,
  imports: [],
  templateUrl: './statement.component.html',
  styleUrl: './statement.component.scss'
})
export class StatementComponent {
  private el = inject(ElementRef);

  words = 'We do not chase the season. We buy one lot, we roast it light, and when it is gone we start again. That is the whole idea.'.split(' ');

  progress = signal(0);

  litCount = computed(() => Math.floor(this.progress() * this.words.length));//rounds down to the nearest whole number

  @HostListener('window:scroll')
  onScroll() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 0) return;

    const scrolled = -rect.top;
    const raw = scrolled / total;
    const clamped = Math.min(1, Math.max(0, raw));
    this.progress.set(clamped);
  }
}