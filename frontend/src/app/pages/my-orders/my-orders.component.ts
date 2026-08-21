import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface OrderItem {
  name: string;
  unitPrice: number;
}

interface OrderHistoryItem {
  id: string;
  time: string;
  status: string;
  total: number;
  items: OrderItem[];
}

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit {
  orders: OrderHistoryItem[] = [];
  loading = true;
  error = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<OrderHistoryItem[]>('/api/orders/me').subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}