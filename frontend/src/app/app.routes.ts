import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { ReservePageComponent } from './pages/reserve-page/reserve-page.component';
import { OrderPageComponent } from './pages/order-page/order-page.component';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { confirmationGuard } from './guards/confirmation.guard';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { MyReservationsComponent } from './pages/my-reservations/my-reservations.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', children: [] }, 
  { path: 'login', component: LoginPageComponent, title: 'Log In' },
  { path: 'signup', component: SignupPageComponent, title: 'Sign Up' },
  { path: 'reserve', component: ReservePageComponent, canActivate: [authGuard], title: 'Reserve a Table' },
    { path: 'order', component: OrderPageComponent, canActivate: [authGuard], title: 'Your Order' },
  { path: 'my-reservations', component: MyReservationsComponent, canActivate: [authGuard], title: 'My Reservations' },
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [authGuard], title: 'Order History' },
  { path: 'reset-password', component: ResetPasswordPageComponent, title: 'Reset Password' },
  { path: 'admin', component: AdminPageComponent, canActivate: [adminGuard], title: 'Admin Dashboard' },
  {
    path: 'confirmation/:id',
    component: ConfirmationPageComponent,
    canActivate: [confirmationGuard],
    title: 'Order Confirmed'
  },
  { path: '**', component: NotFoundPageComponent, title: 'Page Not Found' }
];