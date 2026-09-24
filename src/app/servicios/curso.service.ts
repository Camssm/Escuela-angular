import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz que mapea tu clase Cursos.java
export interface Curso {
  id?: number;
  materia: string;
  nombreMaestro: string;
  numSalon: number;
  administracionId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  // Ajusta la URL según el puerto y endpoint de tu microservicio Cursos
  private URL_RESOURCE = "http://localhost:8082/api/cursos"; 

  constructor(private http: HttpClient) { }

  // Obtener la lista de cursos
  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.URL_RESOURCE);
  }

  // Guardar/Crear un nuevo curso
  nuevoCurso(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(`${this.URL_RESOURCE}/agregar`, curso);
  }
}