import { LoginPageComponent } from './login-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('LoginPageComponent', () => {
  it('should disable the submit button when the form is invalid', () => {
    cy.mount(LoginPageComponent, {
      providers: [provideHttpClient(), provideRouter([])]
    });

    cy.contains('button', 'Log in').should('be.disabled');
  });

  it('should enable the submit button once valid credentials are typed', () => {
    cy.mount(LoginPageComponent, {
      providers: [provideHttpClient(), provideRouter([])]
    });

    cy.get('input[type="email"]').type('emilys@test.com');
    cy.get('input[type="password"]').type('password123');

    cy.contains('button', 'Log in').should('not.be.disabled');
  });
});