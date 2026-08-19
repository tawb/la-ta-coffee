import {
  Component, OnInit, AfterViewInit, OnDestroy,
  signal, computed, ElementRef, ViewChild
} from '@angular/core';

interface HeroDrink {
  name: string;
  note: string;
  bg: string;
  wm: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroSection', { static: true }) heroSection!: ElementRef<HTMLElement>;
  @ViewChild('glowEl') glowEl!: ElementRef<HTMLElement>;

  drinks: HeroDrink[] = [
    { name: 'Cold Brew', note: 'Eighteen hours', bg: '#071528', wm: 'rgba(255,255,255,.10)' },
    { name: 'Iced Latte', note: 'Six ounces', bg: '#123f74', wm: 'rgba(255,255,255,.13)' },
    { name: 'Mocha', note: 'Dark, not sweet', bg: '#0b2647', wm: 'rgba(255,255,255,.11)' },
    { name: 'Matcha Latte', note: 'Ceremonial grade', bg: '#1b5590', wm: 'rgba(255,255,255,.15)' },
    { name: 'Chocolate Matcha', note: 'Layered, not stirred', bg: '#0a1d38', wm: 'rgba(255,255,255,.10)' },
    { name: 'Banana Matcha', note: 'Blended cold', bg: '#174a72', wm: 'rgba(255,255,255,.14)' },
    { name: 'Caramel Matcha', note: 'Salted', bg: '#092037', wm: 'rgba(255,255,255,.11)' }
  ];

  heroOn = signal(false);

  // drives background color, , dots updates immediately
  currentIndex = signal(0);
  current = computed(() => this.drinks[this.currentIndex()]);

  // drives the name/note text updates AFTER the masked wipe animation, so text swaps mid motion
  displayedIndex = signal(0);
  displayed = computed(() => this.drinks[this.displayedIndex()]);

  swapping = signal(false);
//interval keeps runing until we stop it 
  private timer: ReturnType<typeof setInterval> | undefined;
  //timeout runs only once
  private swapTimeout: ReturnType<typeof setTimeout> | undefined;
  // observer watches whether the hero is visible on screen, to pause/resume rotation and replay the glow
  private observer?: IntersectionObserver;

  ngOnInit() {
    setTimeout(() => this.heroOn.set(true), 50);
    this.paint(0);
    this.restartTimer();
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.restartTimer();   // resume rotation once back on screen
          this.retriggerGlow();  // replay the glow-pulse from the start
        } else {
          clearInterval(this.timer); // pause rotation while off-screen
        }
      },
      { threshold: 0.15 }
    );
    this.observer.observe(this.heroSection.nativeElement);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    clearTimeout(this.swapTimeout);
    this.observer?.disconnect();
  }

  private paint(i: number) {
    this.currentIndex.set(i);
    this.swapping.set(true);
    clearTimeout(this.swapTimeout);
    this.swapTimeout = setTimeout(() => {
      this.displayedIndex.set(i);
      this.swapping.set(false);
    }, 260);
  }

  private restartTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.paint((this.currentIndex() + 1) % this.drinks.length);
    }, 2120);
  }

  private retriggerGlow() {
    const el = this.glowEl?.nativeElement;
    if (!el) return;
    el.classList.remove('pulse');
    void el.offsetWidth; // force reflow so the animation can restart from 0
    el.classList.add('pulse');
  }

  goTo(index: number) {
    this.paint(index);
    this.restartTimer();
  }
}