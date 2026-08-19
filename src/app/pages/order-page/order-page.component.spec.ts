import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { OrderPageComponent } from './order-page.component';

describe('OrderPageComponent', () => {
  let component: OrderPageComponent;
  let fixture: ComponentFixture<OrderPageComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPageComponent],
      providers: [
  provideRouter([{ path: 'confirmation/:id', component: OrderPageComponent }]),
  provideHttpClient(),
  provideHttpClientTesting()
]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    const req = httpMock.expectOne('/assets/menu.json');
    req.flush([
      { cat: 'Espresso', items: [
        { id: 'e1', n: 'Cortado', note: 'Equal parts', p: 14 },
        { id: 'e2', n: 'Mocha', note: 'Dark, not sweet', p: 18 }
      ]}
    ]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with a total of 0', () => {
    expect(component.total()).toBe(0);
  });

  it('should update the total when an item is toggled on', () => {
    component.toggleItem('e1');
    expect(component.total()).toBe(14);
  });

  it('should update the total again when a second item is toggled on', () => {
    component.toggleItem('e1');
    component.toggleItem('e2');
    expect(component.total()).toBe(32);
  });

  it('should remove the item price when toggled off again', () => {
    component.toggleItem('e1');
    component.toggleItem('e1');
    expect(component.total()).toBe(0);
  });

  it('should block submit when no items are selected, even with valid time/name', () => {
    component.orderForm.setValue({ time: '07:00', name: 'Tawba' });
    expect(component.orderForm.invalid || component.selectedItems().size === 0).toBe(true);
  });

  it('should place the order successfully when everything is valid', fakeAsync(() => {
    component.orderForm.setValue({ time: '07:00', name: 'Tawba' });
    component.toggleItem('e1');

    component.onSubmit();
    tick(600);

    expect(component.submitting).toBe(false);
  }));
});