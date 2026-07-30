import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SignupPageComponent } from './signup-page.component';

describe('SignupPageComponent', () => {
  const providers = [provideHttpClient(), provideHttpClientTesting(), provideRouter([])];

  it('should disable submit when the form is empty', async () => {
    await render(SignupPageComponent, { providers });

    const button = screen.getByRole('button', { name: /create account/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should reject an invalid phone number', async () => {
    const user = userEvent.setup();
    await render(SignupPageComponent, { providers });

    const phoneInput = screen.getByPlaceholderText('059 000 0000');
    await user.type(phoneInput, '123');
    await user.tab();

    expect(screen.getByText('Phone must be in the format 05X-XXX-XXXX (e.g. 059 000 0000)')).toBeTruthy();
  });

  it('should keep submit disabled until the terms checkbox is checked', async () => {
  const user = userEvent.setup();
  await render(SignupPageComponent, { providers });

  await user.type(screen.getByPlaceholderText('Your name'), 'Tawba');
  await user.type(screen.getByPlaceholderText('059 000 0000'), '0591234567');
  await user.type(screen.getByPlaceholderText('you@example.com'), 'test@test.com');
  await user.type(screen.getByPlaceholderText('At least 8 characters'), 'password123');

  const button = screen.getByRole('button', { name: /create account/i }) as HTMLButtonElement;
  expect(button.disabled).toBe(true);

  await user.click(screen.getByText('I agree to the house rules'));

  expect(button.disabled).toBe(false);
});
});