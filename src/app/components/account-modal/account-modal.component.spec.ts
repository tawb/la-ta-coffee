import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AccountModalComponent } from './account-modal.component';
import { ModalService } from '../../services/modal.service';

describe('AccountModalComponent', () => {
  let component: AccountModalComponent;
  let fixture: ComponentFixture<AccountModalComponent>;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountModalComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountModalComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal when a row link is clicked', () => {
    modalService.open('account');
    fixture.detectChanges();

    const loginLink: HTMLElement = fixture.nativeElement.querySelector('a[routerLink="/login"]');
    loginLink.click();

    expect(modalService.activeModal()).toBeNull();
  });
});