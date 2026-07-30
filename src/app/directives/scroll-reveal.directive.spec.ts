import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ScrollRevealDirective } from './scroll-reveal.directive';
//directives always need a small fake host component,
//  because a directive fundamentally cannot exist
//  without something real to attach to.
@Component({
  template: `<div appScrollReveal>Content</div>`,
  standalone: true,
  imports: [ScrollRevealDirective]
})
class TestHostComponent {}

describe('ScrollRevealDirective', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    //fixture is a  single access point for everything about that one specific component during a test.
    expect(fixture).toBeTruthy();
  });

  it('should apply the base "rv" class automatically', () => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('div');
    expect(el.classList.contains('rv')).toBe(true);
  });
});