import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Curso {
  id?: number;
  materia: string;
  docenteId: number;
  nombreMaestro?: string;
  horario: string;
  cupo: number;
}

@Injectable({ providedIn: 'root' })
export class CursoService {

  private URL_RESOURCE = 'http://localhost:8080/api/cursos';

  constructor(private http: HttpClient) { }

  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.URL_RESOURCE}/cursos`);
  }

  nuevoCurso(curso: Curso): Observable<void> {
    return this.http.put<void>(`${this.URL_RESOURCE}/agregar`, curso);
  }

  editarCurso(curso: Curso): Observable<void> {
    return this.http.put<void>(`${this.URL_RESOURCE}/editar`, curso);
  }

  eliminarCurso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL_RESOURCE}/eliminar/${id}`);
  }
}