import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnosComponent } from './componentes/alumnos/alumnos.component';
import { CursosComponent } from './componentes/cursos/cursos.component';
import { AdministracionComponent } from './componentes/administracion/administracion.component';
import { LoginComponent } from './componentes/login/login.component';
import { LoginGuard } from './guards/login.guard'; // 👈 Lo crearemos en el paso 2

const routes: Routes = [
  // Redirige la ruta principal a /login de una
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  // Rutas protegidas con el guardián
  { path: 'alumnos', component: AlumnosComponent, canActivate: [LoginGuard] },
  { path: 'cursos', component: CursosComponent, canActivate: [LoginGuard] },
  { path: 'administracion', component: AdministracionComponent, canActivate: [LoginGuard] },

  // Cualquier ruta desconocida redirige al login
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }