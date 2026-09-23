import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alumno {
  id?: number;
  nombre: string;
  apellido: string;
  gmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private URL_RESOURCE = "http://localhost:8082/api/alumnos";

  constructor(private http: HttpClient) { }

  getAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.URL_RESOURCE);
  }

  nuevoAlumno(alumno: Alumno): Observable<Alumno> {
 return this.http.post<Alumno>(`${this.URL_RESOURCE}/agregar`, alumno); // 👈 agregado /agregar
  }




} 