import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the current year in the copyright line', () => {
    const bottom: HTMLElement = fixture.nativeElement.querySelector('.foot__bottom');
    expect(bottom.textContent).toContain(new Date().getFullYear().toString());
  });

  it('should show success message after subscribing with a valid email', fakeAsync(() => {
    component.email = 'test@test.com';
    const form = { invalid: false, resetForm: () => {} } as any;

    component.onSubscribe(form);
    tick(400);

    fixture.detectChanges();
    expect(component.submitted).toBe(true);
  }));
});