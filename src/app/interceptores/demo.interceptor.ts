import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Estructuras de datos mock
let usuarios: any[] = [];
let cursos: any[] = [];

function siguienteId(lista: any[]): number {
  return lista.length > 0 ? Math.max(...lista.map(item => item.id || 0)) + 1 : 1;
}

@Injectable()
export class DemoInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, body } = req;

    // Helper para simular respuesta OK con retardo
    const ok = (data?: any) => of(new HttpResponse({ status: 200, body: data })).pipe(delay(500));

    // --- a) BLOQUE DE USUARIOS ---
    if (url.endsWith('/api/usuarios/usuarios')) {
      return ok(usuarios.map(u => ({ habilitado: true, ...u })));
    }
    if (url.endsWith('/api/usuarios/agregar')) {
      usuarios = [...usuarios, { ...body, id: siguienteId(usuarios), password: undefined, habilitado: true }];
      return ok(null);
    }
    const estadoUsuario = url.match(/\/api\/usuarios\/estado\/(\d+)$/);
    if (estadoUsuario) {
      usuarios = usuarios.map(u => u.id === +estadoUsuario[1] ? { ...u, habilitado: body.habilitado } : u);
      return ok(null);
    }

    // --- b) BLOQUE DE CURSOS ---
    if (url.endsWith('/api/cursos/cursos')) {
      return ok(cursos);
    }
    if (url.endsWith('/api/cursos/agregar')) {
      cursos = [...cursos, { ...body, id: siguienteId(cursos) }];
      return ok(null);
    }
    if (url.endsWith('/api/cursos/editar')) {
      cursos = cursos.map(c => c.id === body.id ? { ...body } : c);
      return ok(null);
    }
    const eliminarCurso = url.match(/\/api\/cursos\/eliminar\/(\d+)$/);
    if (eliminarCurso) {
      cursos = cursos.filter(c => c.id !== +eliminarCurso[1]);
      return ok(null);
    }

    // Si la petición no coincide con ninguna ruta mock, continúa su curso normal
    return next.handle(req);
  }
}