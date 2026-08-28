import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface OrderItem {
  name: string;
  unitPrice: number;
}
interface AdminOrder {
  id: string;
  time: string;
  status: string;
  total: number;
  items: OrderItem[];
}
interface AdminReservation {
  id: string;
  date: string;
  time: string;
  party: number;
  status: string;
}
interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}
interface AdminStats {
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: { [key: string]: number };
  averagePartySize: number;
  reservationsByStatus: { [key: string]: number };
}
interface PageResponse<T> {
  content: T[];//this specific page
  totalPages: number;
  totalElements: number;
  number: number;//current page index
}

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
})
export class AdminPageComponent implements OnInit {
  activeTab: 'orders' | 'reservations' | 'users' = 'orders';

  stats: AdminStats | null = null;
  statsLoading = true;
  statsError = false;

  orders: AdminOrder[] = [];
  ordersPage = 0;
  ordersTotalPages = 0;
  ordersLoading = true;
  ordersError = false;

  reservations: AdminReservation[] = [];
  reservationsPage = 0;
  reservationsTotalPages = 0;
  reservationsLoading = true;
  reservationsError = false;

  users: AdminUser[] = [];
  usersPage = 0;
  usersTotalPages = 0;
  usersLoading = true;
  usersError = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStats();
    this.loadOrders(0);
    this.loadReservations(0);
    this.loadUsers(0);
  }

  setTab(tab: 'orders' | 'reservations' | 'users') {
    this.activeTab = tab;
  }

  loadStats() {
    this.statsLoading = true;
    this.statsError = false;
    this.http.get<AdminStats>('/api/orders/admin/stats').subscribe({
      next: (data) => {
        this.stats = data;
        this.statsLoading = false;
      },
      error: () => {
        this.statsError = true;
        this.statsLoading = false;
      }
    });
  }

  loadOrders(page: number) {
    this.ordersLoading = true;
    this.ordersError = false;
    this.http.get<PageResponse<AdminOrder>>(`/api/orders/admin/all?page=${page}`).subscribe({
      next: (data) => {
        this.orders = data.content;
        this.ordersPage = data.number;
        this.ordersTotalPages = data.totalPages;
        this.ordersLoading = false;
      },
      error: () => {
        this.ordersError = true;
        this.ordersLoading = false;
      }
    });
  }

  loadReservations(page: number) {
    this.reservationsLoading = true;
    this.reservationsError = false;
    this.http.get<PageResponse<AdminReservation>>(`/api/reservations/admin/all?page=${page}`).subscribe({
      next: (data) => {
        this.reservations = data.content;
        this.reservationsPage = data.number;
        this.reservationsTotalPages = data.totalPages;
        this.reservationsLoading = false;
      },
      error: () => {
        this.reservationsError = true;
        this.reservationsLoading = false;
      }
    });
  }

  loadUsers(page: number) {
    this.usersLoading = true;
    this.usersError = false;
    this.http.get<PageResponse<AdminUser>>(`/api/users/admin/all?page=${page}`).subscribe({
      next: (data) => {
        this.users = data.content;
        this.usersPage = data.number;
        this.usersTotalPages = data.totalPages;
        this.usersLoading = false;
      },
      error: () => {
        this.usersError = true;
        this.usersLoading = false;
      }
    });
  }

  statusKeys(map: { [key: string]: number }): string[] {//converts it into a real array of strings so we can loop through it 
    return Object.keys(map);
  }
}