import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MagneticDirective } from './magnetic.directive';

@Component({
  template: `<button appMagnetic></button>`,
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
});