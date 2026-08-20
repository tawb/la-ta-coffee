import { Directive, ElementRef, inject, HostListener } from '@angular/core';

@Directive({
  selector: '[appMagnetic]',//attribute
  standalone: true
})
export class MagneticDirective {
  private el = inject(ElementRef);

  @HostListener('mousemove', ['$event'])//Without this, the method would run on every mouse move, but have no way of knowing where the mouse actually is.
  onMouseMove(event: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect();
    //negative number = mouse is left of center, positive = mouse is right of center, zero = exactly centered.
    const x = (event.clientX - rect.left - rect.width / 2) * 0.1;//0.1 makes the pull feel subtle
    const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
    this.el.nativeElement.style.transform = `translate(${x}px, ${y}px)`;
  }
//No ['$event'] needed here, since we don't need any details about the event itself
//  just the fact that it happened.
  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.nativeElement.style.transition = 'transform .7s var(--e)';//animate that change smoothly over 0.7
    this.el.nativeElement.style.transform = '';
    setTimeout(() => {
      this.el.nativeElement.style.transition = '';
    }, 700);
  }
}