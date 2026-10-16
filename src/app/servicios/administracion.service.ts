import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Cargo = 'DIRECTOR' | 'PRECEPTOR' | 'DOCENTE' | 'ADMINISTRATIVO';

export interface Personal {
  id?: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  cargo: Cargo;
}

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {

  private URL_RESOURCE = 'http://localhost:8080/api/administracion';

  constructor(private http: HttpClient) { }

  getPersonal(): Observable<Personal[]> {
    return this.http.get<Personal[]>(`${this.URL_RESOURCE}/Administracion`);
  }

  nuevoPersonal(personal: Personal): Observable<void> {
    return this.http.put<void>(`${this.URL_RESOURCE}/agregar`, personal);
  }

  editarPersonal(personal: Personal): Observable<void> {
    return this.http.put<void>(`${this.URL_RESOURCE}/editar`, personal);
  }
}