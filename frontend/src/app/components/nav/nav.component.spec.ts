import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavComponent } from './nav.component';
import { ModalService } from '../../services/modal.service';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with the mobile menu closed', () => {
    expect(component.menuOpen()).toBe(false);
  });

  it('should toggle the mobile menu open and closed', () => {
    component.toggleMenu();
    expect(component.menuOpen()).toBe(true);

    component.toggleMenu();
    expect(component.menuOpen()).toBe(false);
  });

  it('should add the "x" class to the burger button when menu is open', () => {
    component.toggleMenu();
    fixture.detectChanges();

    const burger: HTMLElement = fixture.nativeElement.querySelector('.burger');
    expect(burger.classList.contains('x')).toBe(true);
  });

  it('should open the search modal when the search icon is clicked', () => {
    const searchButton: HTMLElement = fixture.nativeElement.querySelector('[aria-label="Search"]');
    searchButton.click();

    expect(modalService.activeModal()).toBe('search');
  });
});