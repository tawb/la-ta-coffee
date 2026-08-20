import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { SearchModalComponent } from './search-modal.component';
import { ModalService } from '../../services/modal.service';

describe('SearchModalComponent', () => {
  let component: SearchModalComponent;
  let fixture: ComponentFixture<SearchModalComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchModalComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchModalComponent);
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

  it('should show no results before typing anything', () => {
    expect(component.filteredItems().length).toBe(0);
  });

  it('should filter items by name as the query changes', () => {
    component.searchControl.setValue('cortado');

    expect(component.filteredItems().length).toBe(1);
    expect(component.filteredItems()[0].n).toBe('Cortado');
  });

  it('should filter items by note text too', () => {
    component.searchControl.setValue('dark');

    expect(component.filteredItems().length).toBe(1);
    expect(component.filteredItems()[0].n).toBe('Mocha');
  });
});