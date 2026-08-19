import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

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

  constructor(private http: HttpClient) {}

  // Real endpoint once a backend exists later when i do it :
  // POST /api/auth/login
  // Expects: { email, password }
  // Returns: { id, email, token }
  login(payload: LoginPayload): Observable<LoginResponse> {
    // return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload);

    // Simulated until backend exists no real request, no PII(Personally Identifiable Information) sent anywhere.
    return of({ id: 'sim-1', email: payload.email, token: 'fake-token' }).pipe(delay(500));
  }

  // Real endpoint once a backend exists and i do it :
  // POST /api/auth/signup
  // Expects: { name, phone, email, password }
  // Returns: { id, email, token }
  signup(payload: SignupPayload): Observable<SignupResponse> {
  // return this.http.post<SignupResponse>(`${this.baseUrl}/signup`, payload);

  return of({ id: 'sim-1', email: payload.email, token: 'fake-token' }).pipe(delay(500));}
}