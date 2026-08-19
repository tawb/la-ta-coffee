import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ScrollRevealDirective } from './scroll-reveal.directive';

@Component({
  template: `<div appScrollReveal></div>`,
  standalone: true,
  imports: [ScrollRevealDirective]
})
class TestHostComponent {}

describe('ScrollRevealDirective', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent]
    });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });
});