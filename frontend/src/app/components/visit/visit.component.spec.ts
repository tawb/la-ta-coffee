import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { VisitComponent } from './visit.component';

describe('VisitComponent', () => {
  let component: VisitComponent;
  let fixture: ComponentFixture<VisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(VisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  //CTA = Call To Action
  it('should render both Reserve and Order CTAs', () => {
    const ctas = fixture.nativeElement.querySelectorAll('.cta');
    expect(ctas.length).toBe(2);
  });

  it('should link the CTAs to the correct routes', () => {
    const reserveLink: HTMLAnchorElement = fixture.nativeElement.querySelector('a[href="/reserve"]');
    const orderLink: HTMLAnchorElement = fixture.nativeElement.querySelector('a[href="/order"]');

    expect(reserveLink).toBeTruthy();
    expect(orderLink).toBeTruthy();
  });
});