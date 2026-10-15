import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  id_token?: string;
  token?: string;
  rol?: string;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

private URL_RESOURCE = "http://localhost:8080/auth/login";

  constructor(private http: HttpClient) { }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.URL_RESOURCE, credentials);
  }
}