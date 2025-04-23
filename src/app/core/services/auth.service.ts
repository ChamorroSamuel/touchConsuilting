import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  username: string;
  password: string;
  role: 'Administrador' | 'Empleado';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private users: User[] = [
    { username: 'admin',    password: 'admin123',    role: 'Administrador' },
    { username: 'empleado', password: 'empleado123', role: 'Empleado' }
  ];

  login(username: string, password: string): Observable<boolean> {
    // busca usuario
    const user = this.users.find(u => u.username === username && u.password === password);
    if (!user) {
      return throwError(() => new Error('Credenciales inválidas')).pipe(delay(500));
    }
    const token = btoa(JSON.stringify({ username: user.username, role: user.role }));
    return of(true).pipe(
      delay(500),
      tap(() => localStorage.setItem(this.tokenKey, token))
    );
  }
  register(username: string, password: string, role: string): Observable<boolean> {
    if (this.users.some(u => u.username === username)) {
      return throwError(() => new Error('Usuario ya existe')).pipe(delay(500));
    }
    this.users.push({ username, password, role: role as any });
    const token = btoa(JSON.stringify({ username, role }));
    return of(true).pipe(
      delay(500),
      tap(() => localStorage.setItem(this.tokenKey, token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUser(): { username: string; role: string } | null {
    const t = localStorage.getItem(this.tokenKey);
    if (!t) return null;
    try {
      return JSON.parse(atob(t));
    } catch {
      return null;
    }
  }
}
