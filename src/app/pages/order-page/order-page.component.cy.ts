import { OrderPageComponent } from './order-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('OrderPageComponent', () => {
  it('should update the total when items are selected', () => {
    cy.mount(OrderPageComponent, {
      providers: [provideHttpClient(), provideRouter([])]
    });

   cy.get('.tot').should('exist');
    cy.get('.tot').invoke('text').then((text) => {
  cy.log('Actual total text:', text);
});

    cy.contains('.pick', 'Espresso').click();

    cy.get('.tot').should('contain.text', 'Total₪10');
  });

  it('should disable the submit button until time, name, and at least one item are provided', () => {
    cy.mount(OrderPageComponent, {
      providers: [provideHttpClient(), provideRouter([])]
    });

    cy.contains('button', 'Place order').should('be.disabled');

    cy.get('select').select('07:00');
    cy.get('input[type="text"]').type('Tawba');
    cy.contains('.pick', 'Cortado').click();

    cy.contains('button', 'Place order').should('not.be.disabled');
  });
});