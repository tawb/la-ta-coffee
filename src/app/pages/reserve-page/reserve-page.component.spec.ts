import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReservePageComponent } from './reserve-page.component';

describe('ReservePageComponent', () => {
  let component: ReservePageComponent;
  let fixture: ComponentFixture<ReservePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservePageComponent],
      providers: [ provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
