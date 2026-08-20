import { Component, ElementRef, inject, AfterViewInit, OnDestroy, NgZone } from '@angular/core';

interface GalleryCup {
  name: string;
  note: string;
  slot: number;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private zone = inject(NgZone);

  private section?: HTMLElement;
  private track?: HTMLElement;
  private images: HTMLElement[] = [];
  private rafId?: number;//requestAnimationFrame
  private lastScrollY = -1;

  readonly frameCount = 10;

  cups: GalleryCup[] = [
    { name: 'Cold Brew', note: 'Eighteen hours', slot: 0 },
    { name: 'Iced Latte', note: 'Six ounces', slot: 1 },
    { name: 'Mocha', note: 'Dark, not sweet', slot: 2 },
    { name: 'Matcha Latte', note: 'Ceremonial grade', slot: 3 },
    { name: 'Chocolate Matcha', note: 'Layered', slot: 4 },
    { name: 'Matcha Strawberry', note: 'Seasonal', slot: 5 },
    { name: 'Taro Matcha', note: 'Root and leaf', slot: 6 },
    { name: 'Banana Matcha', note: 'Blended', slot: 7 },
    { name: 'Caramel Matcha', note: 'Salted', slot: 8 },
    { name: 'Mango Matcha', note: 'Cold only', slot: 9 }
  ];

  slotPosition(slot: number): string {
    return (slot / (this.frameCount - 1)) * 100 + '%';
  }

  ngAfterViewInit() {
    this.section = this.el.nativeElement.querySelector('.gal');
    this.track = this.el.nativeElement.querySelector('.gal__t');
    this.images = Array.from(this.el.nativeElement.querySelectorAll('.gal__img'));

    console.log('Gallery init:', { section: this.section, track: this.track, imageCount: this.images.length });
    //Starts the animation loop
    this.zone.runOutsideAngular(() => {//will not trigger Angular's change detection automatically
      this.tick();
    });
  }

  ngOnDestroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  private tick = () => {
    this.rafId = requestAnimationFrame(this.tick);

    if (window.scrollY === this.lastScrollY) return;
    this.lastScrollY = window.scrollY;

    if (!this.section || !this.track) return;

    const rect = this.section.getBoundingClientRect();
    console.log('tick running, rect.top:', rect.top, 'innerHeight:', window.innerHeight);

    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const span = Math.max(1, this.section.offsetHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, -rect.top / span));

    const totalDrag = Math.max(0, this.track.scrollWidth - window.innerWidth * 0.76);//window.innerWidth * 0.76:reserves roughly a quarter of the screen width as breathing room.
    this.track.style.transform = `translate3d(${(-p * totalDrag).toFixed(1)}px, 0, 0)`;

    this.images.forEach((img, i) => {
      const bob = Math.sin(p * 4 + i) * 20;//Math.sin(...) produces a smooth oscillating wave,
      const rotate = Math.sin(p * 3 + i * 0.8) * 6;//each one moves up/down and tilts slightly differently
      img.style.transform = `translateY(${bob.toFixed(1)}px) rotate(${rotate.toFixed(2)}deg)`;
    });
  };
}