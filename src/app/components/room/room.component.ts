import { Component, ElementRef, HostListener, inject, AfterViewInit } from '@angular/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent implements AfterViewInit {
  private el = inject(ElementRef);
  private lines: HTMLElement[] = [];

  ngAfterViewInit() {
    this.lines = Array.from(this.el.nativeElement.querySelectorAll('.ln'));//querySelectorAll returns a NodeList
  }

  @HostListener('window:scroll')
  onScroll() {
    const section = this.el.nativeElement.querySelector('.brk');
    if (!section || this.lines.length === 0) return;

    const rect = section.getBoundingClientRect();//gives the section's current position/size relative to the viewport.
    const span = Math.max(1, section.offsetHeight - window.innerHeight);
    const t = Math.min(1, Math.max(0, -rect.top / span));
    const k = (t - 0.5) * 2;

    this.lines.forEach((line, i) => {
      const dir = i % 2 ? -1 : 1;
      line.style.transform = `translate3d(${(dir * k * 16).toFixed(2)}%, 0, 0)`;
    });
  }
}