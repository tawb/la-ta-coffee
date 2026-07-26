import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { ReservePageComponent } from './pages/reserve-page/reserve-page.component';
import { OrderPageComponent } from './pages/order-page/order-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'reserve', component: ReservePageComponent },
  { path: 'order', component: OrderPageComponent }
];