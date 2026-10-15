import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type RolUsuario = 'DOCENTE' | 'DIRECTOR' | 'PRECEPTOR' | 'ADMINISTRATIVO';

export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
  rol: RolUsuario;
  habilitado?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private URL_RESOURCE = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.URL_RESOURCE}/usuarios`);
  }

  nuevoUsuario(usuario: Usuario): Observable<void> {
    return this.http.put<void>(`${this.URL_RESOURCE}/agregar`, usuario);
  }

    cambiarEstado(id: number, habilitado: boolean): Observable<void> {
    return this.http.put<void>(`${this.URL_RESOURCE}/estado/${id}`, { habilitado });
  }
}