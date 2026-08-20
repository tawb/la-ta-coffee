import { PricePipe } from './price.pipe';

describe('PricePipe', () => {
  let pipe: PricePipe;

  beforeEach(() => {
    pipe = new PricePipe();
  });

  it('should format a whole number with two decimal places', () => {
    expect(pipe.transform(20)).toBe('₪20.00');
  });

  it('should format a decimal number correctly', () => {
    expect(pipe.transform(45.5)).toBe('₪45.50');
  });

  it('should round floating-point noise to two decimals', () => {
    expect(pipe.transform(12.600000000000001)).toBe('₪12.60');
  });

  it('should format zero correctly', () => {
    expect(pipe.transform(0)).toBe('₪0.00');
  });
});