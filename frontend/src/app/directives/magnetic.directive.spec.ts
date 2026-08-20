import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MagneticDirective } from './magnetic.directive';

@Component({
  template: `<button appMagnetic>Click</button>`,
  standalone: true,
  imports: [MagneticDirective]
})
class TestHostComponent {}

describe('MagneticDirective', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

  it('should apply a transform on mousemove', () => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('button');
    const event = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });//fake mouse-move event
    el.dispatchEvent(event);

    expect(el.style.transform).toContain('translate');
  });

  it('should reset the transform on mouseleave', () => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('button');
    el.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));
    el.dispatchEvent(new MouseEvent('mouseleave'));

    expect(el.style.transform).toBe('');
  });
});