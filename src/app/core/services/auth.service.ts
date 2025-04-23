import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface LoginResponse { token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(res => localStorage.setItem(this.tokenKey, res.token)),
        map(() => true)
      );
  }

  register(username: string, password: string, role: string): Observable<boolean> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, { username, password, role })
      .pipe(
        tap(res => localStorage.setItem(this.tokenKey, res.token)),
        map(() => true)
      );
  }

  logout(): void { localStorage.removeItem(this.tokenKey); }
  isLoggedIn(): boolean { return !!localStorage.getItem(this.tokenKey); }
  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
}
