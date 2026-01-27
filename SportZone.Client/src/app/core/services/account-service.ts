import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);
  baseUrl = environment.apiUrl;
  
  register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds,
      { withCredentials: true }).pipe(
        tap(user => {
          if (user) {
            this.setCurrentUser(user);
            // this.startTokenRefreshInterval();
          }
        })
      )
  }

  login(creds: LoginCreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', creds,
      { withCredentials: true }).pipe(
        tap(user => {
          if (user) {
            this.setCurrentUser(user);
            // this.startTokenRefreshInterval();
          }
        })
      )
  }

  refreshToken() {
    return this.http.post<User>(this.baseUrl + 'account/refresh-token', {},
      { withCredentials: true })
  }

  startTokenRefreshInterval() {
    setInterval(() => {
      this.http.post<User>(this.baseUrl + 'account/refresh-token', {},
        { withCredentials: true }).subscribe({
          next: user => {
            this.setCurrentUser(user)
          },
          error: () => {
            this.logout()
          }
        })
    }, 14 * 24 * 60 * 60 * 1000) // 14 days
  }

  setCurrentUser(user: User) {
    user.roles = this.getRolesFromToken(user);
    this.currentUser.set(user);
  }

  logout() {
    this.http.post(this.baseUrl + 'account/logout', {}, { withCredentials: true }).subscribe({
      next: () => {
        localStorage.removeItem('filters');
      }
    })

  }

  private getRolesFromToken(user: User): string[] {
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const jsonPayload = JSON.parse(decoded);
    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role]
  }
}