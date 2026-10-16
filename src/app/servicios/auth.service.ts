import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export type Rol = 'ROOT' | 'DOCENTE' | 'DIRECTOR' | 'PRECEPTOR' | 'ADMINISTRATIVO';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private router: Router) { }

  guardarSesion(token: string): void {
    localStorage.setItem('token', token);

    const datos = this.leerToken(token);

    if (datos?.rol) {
      localStorage.setItem('rol', String(datos.rol).replace('ROLE_', '').toUpperCase());
    }
    if (datos?.sub) {
      localStorage.setItem('username', String(datos.sub));
    }
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }

  get rol(): Rol | null {
    return localStorage.getItem('rol') as Rol | null;
  }

  get username(): string | null {
    return localStorage.getItem('username');
  }

  tieneRol(...roles: Rol[]): boolean {
    const actual = this.rol;
    return !!actual && roles.includes(actual);
  }

  puedeCrearCursos(): boolean {
    return this.tieneRol('ROOT', 'PRECEPTOR');
  }

  puedeGestionarAlumnos(): boolean {
    return this.tieneRol('PRECEPTOR');
  }

  puedeEditarNotas(): boolean {
    return this.tieneRol('DOCENTE');
  }

  inicioPorRol(): string {
    switch (this.rol) {
      case 'ROOT':
      case 'ADMINISTRATIVO': return '/usuarios';
      case 'DOCENTE': return '/notas';
      case 'DIRECTOR': return '/cursos';
      case 'PRECEPTOR': return '/alumnos';
      default: return '/login';
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('username');
    localStorage.removeItem('demo');
    this.router.navigate(['/login']);
  }

  private leerToken(token: string): any {
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}