import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

export interface MenuItem {
  id: string;
  n: string;
  note: string;
  p: number;
}

export interface MenuCategory {
  cat: string;
  items: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuUrl = '/assets/menu.json';

  menu = signal<MenuCategory[]>([]);
  isLoading = signal(false);
  loadError = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  getMenu(): Observable<MenuCategory[]> {
    this.isLoading.set(true);
    this.loadError.set(null);

    return this.http.get<MenuCategory[]>(this.menuUrl).pipe(
      tap(data => {
        this.menu.set(data);
        this.isLoading.set(false);
      }),
      catchError(err => {
        this.isLoading.set(false);
        this.loadError.set('Could not load the menu. Please try again.');
        return throwError(() => err);
      })
    );
  }

  getAllItemsFlat(): MenuItem[] {
    return this.menu().flatMap(category => category.items);
  }
}