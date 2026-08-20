import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { provideRouter } from '@angular/router';
import { ReservePageComponent } from './reserve-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
describe('ReservePageComponent', () => {
  const providers = [provideRouter([]), provideHttpClient(), provideHttpClientTesting()];

  it('should reveal all validation errors when submitting an empty form', async () => {
  const user = userEvent.setup();
  await render(ReservePageComponent, { providers });

  const button = screen.getByRole('button', { name: /confirm reservation/i });
  await user.click(button);

  expect(screen.getByText('Date is required')).toBeTruthy();
  expect(screen.getByText('Pick a time')).toBeTruthy();
  expect(screen.getByText('Party size is required')).toBeTruthy();
  expect(screen.getByText('Name is required')).toBeTruthy();
});

  it('should reject a past date', async () => {
    const { fixture } = await render(ReservePageComponent, { providers });

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yyyy = yesterday.getFullYear();
    const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
    const dd = String(yesterday.getDate()).padStart(2, '0');

    const dateInput = fixture.nativeElement.querySelector('input[type="date"]');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
    dateInput.dispatchEvent(new Event('input'));
    dateInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(screen.getByText('Please pick today or a future date')).toBeTruthy();
  });

  it('should reject an earlier time slot on today\'s date', async () => {
    const { fixture } = await render(ReservePageComponent, { providers });

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const dateInput = fixture.nativeElement.querySelector('input[type="date"]');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
    dateInput.dispatchEvent(new Event('input'));

    const timeSelect = fixture.nativeElement.querySelector('select[formControlName="time"]');
    timeSelect.value = '07:00';
    timeSelect.dispatchEvent(new Event('change'));
    timeSelect.dispatchEvent(new Event('blur'));//the user has now clicked/tabbed away from this field.

    fixture.detectChanges();

    expect(screen.getByText('That time has already passed today')).toBeTruthy();
  });
});