import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Administracion {
  id?: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  especialidad: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {

  private URL_RESOURCE = 'http://localhost:8080/api/administracion';

  constructor(private http: HttpClient) { }

  getAdministraciones(): Observable<Administracion[]> {
    return this.http.get<Administracion[]>(
      `${this.URL_RESOURCE}/Administracion`
    );
  }

  nuevaAdministracion(
    administracion: Administracion
  ): Observable<Administracion> {

    return this.http.put<Administracion>(
      `${this.URL_RESOURCE}/agregar`,
      administracion
    );
  }
}