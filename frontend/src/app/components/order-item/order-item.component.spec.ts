import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderItemComponent } from './order-item.component';

describe('OrderItemComponent', () => {
  let component: OrderItemComponent;
  let fixture: ComponentFixture<OrderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', { id: 'test-1', n: 'Cortado', note: 'Equal parts', p: 14 });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the item id when clicked', () => {
    let emittedId: string | undefined;
    component.toggled.subscribe((id: string) => { emittedId = id; });

    fixture.nativeElement.querySelector('.pick').click();

    expect(emittedId).toBe('test-1');
  });

  it('should show the checked visual state when selected is true', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();

    const box = fixture.nativeElement.querySelector('.pick__b');
    expect(box.classList.contains('on')).toBe(true);
  });
});