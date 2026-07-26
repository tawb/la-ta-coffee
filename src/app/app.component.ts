import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { SignupModalComponent } from './components/signup-modal/signup-modal.component';
import { ResetModalComponent } from './components/reset-modal/reset-modal.component';
import { AccountModalComponent } from './components/account-modal/account-modal.component';
import { SearchModalComponent} from './components/search-modal/search-modal.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavComponent,LoginModalComponent,SignupModalComponent, ResetModalComponent,AccountModalComponent,SearchModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'la-ta-coffee-ng';
}
