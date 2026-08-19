import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { ReservePageComponent } from './pages/reserve-page/reserve-page.component';
import { OrderPageComponent } from './pages/order-page/order-page.component';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page.component';
import { confirmationGuard } from './guards/confirmation.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'reserve', component: ReservePageComponent },
  { path: 'order', component: OrderPageComponent },
  { path: 'confirmation/:id', component: ConfirmationPageComponent, canActivate: [confirmationGuard] }
];