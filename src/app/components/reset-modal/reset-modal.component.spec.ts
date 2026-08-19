import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ResetModalComponent } from './reset-modal.component';
import { ModalService } from '../../services/modal.service';

describe('ResetModalComponent', () => {
  let component: ResetModalComponent;
  let fixture: ComponentFixture<ResetModalComponent>;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetModalComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetModalComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have the open class when modal is not active', () => {
    const modal: HTMLElement = fixture.nativeElement.querySelector('.modal');
    expect(modal.classList.contains('open')).toBe(false);
  });

  it('should have the open class when this modal becomes active', () => {
    modalService.open('reset');
    fixture.detectChanges();

    const modal: HTMLElement = fixture.nativeElement.querySelector('.modal');
    expect(modal.classList.contains('open')).toBe(true);
  });

  it('should disable submit until a valid email is entered', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);

    component.resetForm.setValue({ email: 'test@test.com' });
    fixture.detectChanges();

    expect(button.disabled).toBe(false);
  });
});