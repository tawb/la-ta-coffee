import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface ReservationHistoryItem {
  id: string;
  date: string;
  time: string;
  party: number;
  status: string;
}

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.scss'
})
export class MyReservationsComponent implements OnInit {
  reservations: ReservationHistoryItem[] = [];
  loading = true;
  error = false;
  cancellingId: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.loading = true;
    this.http.get<ReservationHistoryItem[]>('/api/reservations/me').subscribe({
      next: (data) => {
        this.reservations = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  cancelReservation(id: string) {
    this.cancellingId = id;
    this.http.put<ReservationHistoryItem>(`/api/reservations/${id}/cancel`, {}).subscribe({
      next: () => {
        this.cancellingId = null;
        this.loadReservations();
      },
      error: () => {
        this.cancellingId = null;
        alert('Could not cancel this reservation.');
      }
    });
  }
}