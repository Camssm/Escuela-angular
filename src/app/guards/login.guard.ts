import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const LoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Revisa si existe el token JWT guardado en el navegador
  const token = localStorage.getItem('token');

  if (token) {
    return true; // Si hay token, lo deja pasar
  } else {
    // Si no hay token, lo manda de patitas a la calle al login
    router.navigate(['/login']);
    return false;
  }
};