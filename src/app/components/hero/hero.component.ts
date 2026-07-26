import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';

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
export class HeroComponent implements OnInit, OnDestroy {
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

  ngOnInit() {
    setTimeout(() => this.heroOn.set(true), 50);
    this.paint(0);
    this.restartTimer();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    clearTimeout(this.swapTimeout);
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

  goTo(index: number) {
    this.paint(index);
    this.restartTimer();
  }
}