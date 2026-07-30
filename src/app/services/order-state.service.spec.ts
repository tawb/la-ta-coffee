import { TestBed } from '@angular/core/testing';
import { OrderStateService } from './order-state.service';

describe('OrderStateService', () => {
  let service: OrderStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a 6-character confirmation id', () => {
    const id = service.createConfirmation();
    expect(id.length).toBe(6);
  });

  it('should consider a freshly created id as valid', () => {
    const id = service.createConfirmation();
    expect(service.isValidConfirmation(id)).toBe(true);
  });

  it('should consider a random, never-created id as invalid', () => {
    expect(service.isValidConfirmation('FAKE99')).toBe(false);
  });

  it('should keep multiple confirmation ids valid at the same time', () => {
    const id1 = service.createConfirmation();
    const id2 = service.createConfirmation();

    expect(service.isValidConfirmation(id1)).toBe(true);
    expect(service.isValidConfirmation(id2)).toBe(true);
  });

  it('should invalidate all ids after clear() is called', () => {
    const id = service.createConfirmation();
    service.clear();

    expect(service.isValidConfirmation(id)).toBe(false);
  });
});