import { Component, ElementRef, inject, AfterViewInit, OnDestroy, NgZone } from '@angular/core';

interface ScatterChar {
  ch: string;
  x: number;
  y: number;
  r: number;
  accent: boolean;
}

@Component({
  selector: 'app-craft',
  standalone: true,
  imports: [],
  templateUrl: './craft.component.html',
  styleUrl: './craft.component.scss'
})
export class CraftComponent implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private zone = inject(NgZone);

  private section?: HTMLElement;
  private charElsA: HTMLElement[] = [];
  private charElsB: HTMLElement[] = [];
  private rafId?: number;
  private lastScrollY = -1;

  charsA = this.buildScatterChars('One bean.', false);//true and false for the colors 
  charsB = this.buildScatterChars('One pour.', true);

  private buildScatterChars(text: string, accent: boolean): ScatterChar[] {
    return text.split('').map((ch, i) => {
      const a = Math.sin(i * 12.9898 + text.length * 78.233) * 43758.5453;
      const b = Math.sin(i * 39.3468 + text.length * 11.135) * 24634.6345;
      return {
        ch: ch === ' ' ? '\u00A0' : ch,//because Plain spaces can sometimes get collapsed/trimmed by HTML rendering
        x: (a - Math.floor(a)) * 2 - 1,
        y: (b - Math.floor(b)) * 2 - 1,
        r: (a - Math.floor(a)) - 0.5,
        accent
      };
    });
  }

  ngAfterViewInit() {
    this.section = this.el.nativeElement.querySelector('.craft__pin');
    this.charElsA = Array.from(this.el.nativeElement.querySelectorAll('.asm-a .ch'));
    this.charElsB = Array.from(this.el.nativeElement.querySelectorAll('.asm-b .ch'));

    this.zone.runOutsideAngular(() => {
      this.tick();
    });
  }

  ngOnDestroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  private place(els: HTMLElement[], chars: ScatterChar[], k: number) {
    const clampedK = Math.min(1, Math.max(0, k));
    const e = 1 - Math.pow(1 - clampedK, 3);
    const inv = 1 - e;

    els.forEach((el, i) => {
      const c = chars[i];
      el.style.transform = `translate3d(${(c.x * inv * 220).toFixed(1)}px, ${(c.y * inv * 150).toFixed(1)}px, 0) rotate(${(c.r * inv * 110).toFixed(1)}deg) scale(${(1 + inv * 1.35).toFixed(3)})`;
      el.style.opacity = e.toFixed(3);
      el.style.filter = `blur(${(inv * 16).toFixed(1)}px)`;
    });
  }

  private tick = () => {
    this.rafId = requestAnimationFrame(this.tick);

    if (window.scrollY === this.lastScrollY) return;
    this.lastScrollY = window.scrollY;

    if (!this.section) return;

    const rect = this.section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const span = Math.max(1, this.section.offsetHeight - window.innerHeight);
    const t = Math.min(1, Math.max(0, -rect.top / span));

    const aK = t < 0.30 ? Math.pow(t / 0.30, 2) : (t < 0.52 ? 1 : 1 - (t - 0.52) / 0.14);
    const bK = t < 0.60 ? 0 : Math.min(1, (t - 0.60) / 0.30);

    this.place(this.charElsA, this.charsA, aK);
    this.place(this.charElsB, this.charsB, bK);
  };
}