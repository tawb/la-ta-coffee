import { TestBed } from '@angular/core/testing';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with no active modal', () => {
    expect(service.activeModal()).toBeNull();
  });

  it('should set the active modal when open is called', () => {
    service.open('login');
    expect(service.activeModal()).toBe('login');
  });

  it('should clear the active modal when close is called', () => {
    service.open('signup');
    service.close();
    expect(service.activeModal()).toBeNull();
  });

  it('should switch to a different modal when open is called again', () => {
    service.open('login');
    service.open('reset');
    expect(service.activeModal()).toBe('reset');
  });
});