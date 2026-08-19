import { Directive, ElementRef, inject, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
  host: { class: 'rv' }//always add the CSS class rv to whatever element I'm placed on
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private observer?: IntersectionObserver;//since it doesn't get created until ngOnInit
//built-in IntersectionObserver class.
  ngOnInit() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {//true if the element is currently visible
          this.el.nativeElement.classList.add('in');
        }
      });
    }, { threshold: 0.15 });//only consider this element 'intersecting' once at least 15% of it is visible within the viewport

    this.observer.observe(this.el.nativeElement);//Nothing happens until this line runs
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}