import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  id: string;
  email: string;
  token: string;
}

interface SignupPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
}
interface SignupResponse {
  id: string;
  email: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/api/auth';

  // Tracks login state app-wide so components (nav, guards) can react to it.
  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));
  currentEmail = signal<string | null>(localStorage.getItem('userEmail'));
  currentRole = signal<string | null>(localStorage.getItem('userRole'));

  constructor(private http: HttpClient) {}

  // POST /api/auth/login
  // Expects: { email, password }
  // Returns: { id, email, token }
  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap(response => this.storeSession(response))
    );
  }

  // POST /api/auth/signup
  // Expects: { name, phone, email, password }
  // Returns: { id, email, token }
  signup(payload: SignupPayload): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.baseUrl}/signup`, payload).pipe(
      tap(response => this.storeSession(response))
    );
  }

  isAdmin(): boolean {
    return this.currentRole() === 'ADMIN';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    this.isLoggedIn.set(false);
    this.currentEmail.set(null);
    this.currentRole.set(null);
  }

  private storeSession(response: LoginResponse | SignupResponse) {
    // auth.interceptor.ts reads this exact key ('token') and attaches it
    // as "Authorization: Bearer <token>" to every outgoing request.
    localStorage.setItem('token', response.token);
    localStorage.setItem('userEmail', response.email);

    const role = this.decodeRole(response.token);
    if (role) {
      localStorage.setItem('userRole', role);
    }

    this.isLoggedIn.set(true);
    this.currentEmail.set(response.email);
    this.currentRole.set(role);
  }

  private decodeRole(token: string): string | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.role ?? null;
    } catch {
      return null;
    }
  }
}