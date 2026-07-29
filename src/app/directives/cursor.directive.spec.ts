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
    TestBed.configureTestingModule({
      imports: [TestHostComponent]
    });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });
});