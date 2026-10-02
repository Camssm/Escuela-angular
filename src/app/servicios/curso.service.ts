import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  private URL_RESOURCE = 'http://localhost:8080/api/cursos';

  constructor(private http: HttpClient) { }

  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.URL_RESOURCE}/cursos`);
  }

  nuevoCurso(curso: Curso): Observable<void> {
    return this.http.put<void>(`${this.URL_RESOURCE}/agregar`, curso);
  }
}