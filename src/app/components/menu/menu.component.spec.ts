import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and display categories from the menu service', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('/assets/menu.json');
    req.flush([
      { cat: 'Espresso', items: [{ id: 'e1', n: 'Cortado', note: 'Equal parts', p: 14 }] }
    ]);

    fixture.detectChanges();

    expect(component.categories.length).toBe(1);
    expect(component.categories[0].cat).toBe('Espresso');
  });

  it('should navigate to /order with the item id when an item is clicked', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('/assets/menu.json');
    req.flush([
      { cat: 'Espresso', items: [{ id: 'e1', n: 'Cortado', note: 'Equal parts', p: 14 }] }
    ]);
    fixture.detectChanges();

    spyOn(router, 'navigate');

    component.onItemOrdered('e1');

    expect(router.navigate).toHaveBeenCalledWith(['/order'], { queryParams: { preselect: 'e1' } });
  });
});