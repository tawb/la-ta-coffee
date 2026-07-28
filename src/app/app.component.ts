import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { signal } from '@angular/core';
import { NavComponent } from './components/nav/nav.component';
import { HeroComponent } from './components/hero/hero.component';
import { ResetModalComponent } from './components/reset-modal/reset-modal.component';
import { AccountModalComponent } from './components/account-modal/account-modal.component';
import { SearchModalComponent } from './components/search-modal/search-modal.component';
import { RoomComponent } from './components/room/room.component';
import { StatementComponent } from './components/statement/statement.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { MenuComponent } from './components/menu/menu.component';
import { CraftComponent } from './components/craft/craft.component';
import { VisitComponent } from './components/visit/visit.component';
import { FooterComponent } from './components/footer/footer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, NavComponent, HeroComponent,
    ResetModalComponent, AccountModalComponent, SearchModalComponent,
    RoomComponent,StatementComponent,GalleryComponent,MenuComponent,CraftComponent,
    VisitComponent,FooterComponent
  
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isHomePage = signal(true);

  constructor(private router: Router) {
  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      const pathOnly = event.urlAfterRedirects.split('#')[0].split('?')[0];
      this.isHomePage.set(pathOnly === '/');
    }
  });
}
}