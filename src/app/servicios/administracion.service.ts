import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Administracion {
  id?: number;
  nombre: string;
  apellido: string;
  dni: number;
  email: string;
  especialidad: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {

    private URL_RESOURCE = "http://localhost:8083/api/administracion";

  constructor(private http: HttpClient) { }

 getAdministracion(): Observable<Administracion[]> {
  return this.http.get<Administracion[]>(`${this.URL_RESOURCE}/listar`);
}

  nuevaAdministracion(administracion: Administracion): Observable<Administracion> {
 return this.http.post<Administracion>(`${this.URL_RESOURCE}/agregar`, administracion);
  }

}
