import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { AuthResponse } from '../interfaces/auth-response';
import { DecodedToken } from '../interfaces/decoded-token';
import { API_BASE_URL } from '../app.config';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class EnviarDatosService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  enviarFormularioRegistro(data: User): Observable<AuthResponse> {
    const token = this.cookieService.get('jwt');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });

    return this.http.post(`${API_BASE_URL}/register`, data, { headers, withCredentials: true });
  }

  enviarFormularioLogin(data: User): Observable<AuthResponse> {
    return this.http.post(`${API_BASE_URL}/login`, data, { withCredentials: true });
  }

  isAuthenticated(): boolean {
    return this.cookieService.check('jwt');
  }

  getUserRole(): 'admin' | 'operario' | null {
    const token = this.cookieService.get('jwt');
  
    if (!token) {
      console.log('Token no encontrado.');
      return null;
    }
  
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      console.log('Token decodificado:', decodedToken);
      return decodedToken.admin === 1 ? 'admin' : 'operario';
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  getUsername(): string | null {
    const token = this.cookieService.get('jwt');
  
    if (!token) {
      console.log('Token no encontrado.');
      return null;
    }
  
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      console.log('Token decodificado:', decodedToken);
      return decodedToken.username || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
}
