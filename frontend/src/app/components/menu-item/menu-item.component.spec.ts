import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuItemComponent } from './menu-item.component';

describe('MenuItemComponent', () => {
  let component: MenuItemComponent;
  let fixture: ComponentFixture<MenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuItemComponent);
    component = fixture.componentInstance;
    component.item = { id: 'test-1', n: 'Cortado', note: 'Equal parts', p: 14 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the item name and formatted price', () => {
    const nameEl: HTMLElement = fixture.nativeElement.querySelector('.row__n');
    const priceEl: HTMLElement = fixture.nativeElement.querySelector('.row__p');

    expect(nameEl.textContent).toContain('Cortado');
    expect(priceEl.textContent).toContain('₪14.00');
  });

  it('should emit the item id when clicked', () => {
    let emittedId: string | undefined;
    component.ordered.subscribe((id: string) => { emittedId = id; });

    const button: HTMLElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(emittedId).toBe('test-1');
  });
});