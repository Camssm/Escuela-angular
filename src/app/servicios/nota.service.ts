import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Nota {
  id?: number;
  valor: number;
  evaluacionId: number;
  alumnoId: number;
}

@Injectable({ providedIn: 'root' })
export class NotaService {

  private URL_RESOURCE = 'http://localhost:8080/api/notas';

  constructor(private http: HttpClient) { }

  getPorEvaluacion(evaluacionId: number): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.URL_RESOURCE}/evaluacion/${evaluacionId}`);
  }

  crear(nota: Nota): Observable<Nota> {
    return this.http.post<Nota>(this.URL_RESOURCE, nota);
  }

  editar(id: number, valor: number): Observable<Nota> {
    return this.http.put<Nota>(`${this.URL_RESOURCE}/${id}`, { valor });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL_RESOURCE}/${id}`);
  }
}