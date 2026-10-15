import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Nota {
  id?: number;
  alumnoId: number;
  cursoId: number;
  evaluacion: string;
  nota: number;
}

@Injectable({ providedIn: 'root' })
export class NotaService {

  private URL_RESOURCE = 'http://localhost:8080/api/notas';

  constructor(private http: HttpClient) { }

  getNotas(): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.URL_RESOURCE}/notas`);
  }

  nuevaNota(nota: Nota): Observable<void> {
    return this.http.put<void>(`${this.URL_RESOURCE}/agregar`, nota);
  }

  modificarNota(id: number, nota: Nota): Observable<void> {
    return this.http.put<void>(`${this.URL_RESOURCE}/modificar/${id}`, nota);
  }

  eliminarNota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL_RESOURCE}/eliminar/${id}`);
  }
}