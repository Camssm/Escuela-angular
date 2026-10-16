import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CuentaNueva {
  username: string;
  password: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private URL_RESOURCE = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  crearCuenta(cuenta: CuentaNueva): Observable<void> {
    return this.http.post<void>(`${this.URL_RESOURCE}/usuarios`, cuenta);
  }
}