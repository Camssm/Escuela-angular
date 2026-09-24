import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz liviana solo para estructurar las credenciales que enviamos
export interface LoginCredentials {
  username: string;
  password: string;
}

// Interfaz para mapear la respuesta que devuelve tu backend (por ej. el token JWT)
export interface AuthResponse {
  id_token?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private URL_RESOURCE = "http://localhost:8085/auth/login";

  constructor(private http: HttpClient) { }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.URL_RESOURCE, credentials);
  }
}