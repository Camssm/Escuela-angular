import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export type Rol = 'ROOT' | 'DOCENTE' | 'DIRECTOR' | 'PRECEPTOR' | 'ADMINISTRATIVO';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private router: Router) { }

  guardarSesion(token: string, rol?: string, usuarioId?: number): void {
    localStorage.setItem('token', token);

    const rolFinal = rol ?? this.rolDesdeToken(token);
    if (rolFinal) {
      localStorage.setItem('rol', this.normalizar(rolFinal));
    }

    const idFinal = usuarioId ?? this.idDesdeToken(token);
    if (idFinal !== null && idFinal !== undefined) {
      localStorage.setItem('usuarioId', String(idFinal));
    }
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }

  get rol(): Rol | null {
    return localStorage.getItem('rol') as Rol | null;
  }

  get usuarioId(): number | null {
    const valor = localStorage.getItem('usuarioId');
    return valor ? Number(valor) : null;
  }

  tieneRol(...roles: Rol[]): boolean {
    const actual = this.rol;
    return !!actual && roles.includes(actual);
  }

  // Permisos (solo para mostrar/ocultar en pantalla)
  puedeCrearCursos(): boolean {
    return this.tieneRol('ROOT', 'PRECEPTOR', 'ADMINISTRATIVO');
  }

  puedeEditarNotas(): boolean {
    return this.tieneRol('DOCENTE');
  }

  inicioPorRol(): string {
    switch (this.rol) {
      case 'ROOT': return '/usuarios';
      case 'DOCENTE': return '/notas';
      case 'DIRECTOR': return '/cursos';
      case 'PRECEPTOR':
      case 'ADMINISTRATIVO': return '/alumnos';
      default: return '/login';
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('demo');
    this.router.navigate(['/login']);
  }

  private normalizar(rol: string): string {
    return rol.replace('ROLE_', '').toUpperCase();
  }

  private leerToken(token: string): any {
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  private rolDesdeToken(token: string): string | null {
    const datos = this.leerToken(token);
    if (!datos) return null;
    const valor = datos.rol ?? datos.role ?? datos.roles ?? datos.auth ?? datos.authorities;
    return Array.isArray(valor) ? valor[0] : valor ?? null;
  }

  private idDesdeToken(token: string): number | null {
    const datos = this.leerToken(token);
    if (!datos) return null;
    const valor = datos.id ?? datos.userId ?? datos.usuarioId;
    return valor !== undefined ? Number(valor) : null;
  }
}