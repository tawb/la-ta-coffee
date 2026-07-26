import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { HeroComponent } from './components/hero/hero.component';
import { ResetModalComponent } from './components/reset-modal/reset-modal.component';
import { AccountModalComponent } from './components/account-modal/account-modal.component';
import { SearchModalComponent } from './components/search-modal/search-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    HeroComponent,
    ResetModalComponent,
    AccountModalComponent,
    SearchModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'la-ta-coffee-ng';
}