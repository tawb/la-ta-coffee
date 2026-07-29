import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  it('should disable the submit button when the form is invalid', async () => {
    await render(LoginPageComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    });

    const button = screen.getByRole('button', { name: /log in/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should enable the submit button once valid credentials are typed', async () => {
    const user = userEvent.setup();
    debugger
    ;
    await render(LoginPageComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    });

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const button = screen.getByRole('button', { name: /log in/i }) as HTMLButtonElement;

    await user.type(emailInput, 'emilys@test.com');
    await user.type(passwordInput, 'password123');

    expect(button.disabled).toBe(false);
  });

  it('should show a validation error after typing an invalid email and clicking away', async () => {
    const user = userEvent.setup();

    await render(LoginPageComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    });

    const emailInput = screen.getByPlaceholderText('you@example.com');

    await user.type(emailInput, 'not-an-email');
    await user.tab();

    expect(screen.getByText('Enter a valid email')).toBeTruthy();
  });
});