import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface MenuItem {
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
  private cachedMenu: MenuCategory[] = [];

  constructor(private http: HttpClient) {}

  getMenu(): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(this.menuUrl).pipe(
      map(data => {
        this.cachedMenu = data;
        return data;
      }),
      catchError(err => {
        console.error('Failed to load menu:', err);
        return of([]);
      })
    );
  }

  getAllItemsFlat(): MenuItem[] {
    return this.cachedMenu.flatMap(category => category.items);
  }
}