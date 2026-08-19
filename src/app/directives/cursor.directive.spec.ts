import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CursorDirective } from './cursor.directive';

@Component({
  template: `<div appCursor></div>`,
  standalone: true,
  imports: [CursorDirective]
})
class TestHostComponent {}

describe('CursorDirective', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

  it('should update position on document mousemove', () => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('div');
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 80 }));

    expect(el.style.left).toBe('120px');
    expect(el.style.top).toBe('80px');
  });
});