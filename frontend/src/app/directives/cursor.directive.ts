import { Directive, ElementRef, inject, HostListener } from '@angular/core';

@Directive({
  selector: '[appCursor]',
  standalone: true
})
export class CursorDirective {
  private el = inject(ElementRef);

  @HostListener('document:mousemove', ['$event'])
  onMove(event: MouseEvent) {
    this.el.nativeElement.style.left = event.clientX + 'px';
    this.el.nativeElement.style.top = event.clientY + 'px';
  }
}