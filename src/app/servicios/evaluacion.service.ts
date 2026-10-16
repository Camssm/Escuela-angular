import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type TipoEvaluacion =
  'EXAMEN' | 'EXAMEN_ORAL' | 'EXAMEN_PRACTICO' | 'TP_PRACTICO' | 'RECUPERATORIO' | 'TRABAJO_GRUPAL';

export interface Evaluacion {
  id?: number;
  tipo: TipoEvaluacion;
  descripcion: string;
  fecha: string;
  cursoId: number;
}

@Injectable({ providedIn: 'root' })
export class EvaluacionService {

  private URL_RESOURCE = 'http://localhost:8080/api/evaluaciones';

  constructor(private http: HttpClient) { }

  getPorCurso(cursoId: number): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(`${this.URL_RESOURCE}/curso/${cursoId}`);
  }

  crear(evaluacion: Evaluacion): Observable<Evaluacion> {
    return this.http.post<Evaluacion>(this.URL_RESOURCE, evaluacion);
  }
}