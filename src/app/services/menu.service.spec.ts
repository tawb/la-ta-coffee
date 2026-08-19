import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(MenuService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the menu and update the menu signal', () => {
    const mockData = [
      { cat: 'Espresso', items: [{ id: 'e1', n: 'Cortado', note: 'Equal parts', p: 14 }] }
    ];

    service.getMenu().subscribe();

    const req = httpMock.expectOne('/assets/menu.json');
    req.flush(mockData);

    expect(service.menu()).toEqual(mockData);
  });

  it('should flatten categories into a single item list', () => {
    const mockData = [
      { cat: 'Espresso', items: [{ id: 'e1', n: 'Cortado', note: 'Equal parts', p: 14 }] },
      { cat: 'Cold', items: [{ id: 'c1', n: 'Cold Brew', note: 'Eighteen hours', p: 20 }] }
    ];

    service.getMenu().subscribe();
    httpMock.expectOne('/assets/menu.json').flush(mockData);

    const flat = service.getAllItemsFlat();
    expect(flat.length).toBe(2);
    //extracts just its n (name)
    expect(flat.map(i => i.n)).toEqual(['Cortado', 'Cold Brew']);
  });

  it('should set loadError when the request fails', () => {
    service.getMenu().subscribe({ error: () => {} });

    const req = httpMock.expectOne('/assets/menu.json');
    req.flush('error', { status: 500, statusText: 'Server Error' });

    expect(service.loadError()).toBeTruthy();
  });
});