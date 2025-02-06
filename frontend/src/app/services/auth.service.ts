import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isLoggedIn(): boolean {
    return document.cookie.includes('jwt=');
  }

  setAuthToken(token: string): void {
    document.cookie = `jwt=${token}; path=/;`;
  }

  logout(): void {
    document.cookie = 'jwt=; Max-Age=0; path=/;';
  }
}
