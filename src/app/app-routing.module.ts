import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnosComponent } from './componentes/alumnos/alumnos.component';
import { CursosComponent } from './componentes/cursos/cursos.component';
import { AdministracionComponent } from './componentes/administracion/administracion.component';
import { LoginComponent } from './componentes/login/login.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { NotasComponent } from './componentes/notas/notas.component';
import { LoginGuard } from './guards/login.guard';
import { rolGuard } from './guards/rol.guard';

const routes: Routes = [
  // Redirige la ruta principal a /login de una
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  // Rutas protegidas: primero que haya sesión, después que el rol corresponda
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [LoginGuard, rolGuard('ROOT', 'DIRECTOR')]
  },
  {
    path: 'alumnos',
    component: AlumnosComponent,
    canActivate: [LoginGuard, rolGuard('PRECEPTOR', 'ADMINISTRATIVO')]
  },
  {
    path: 'notas',
    component: NotasComponent,
    canActivate: [LoginGuard, rolGuard('DOCENTE', 'DIRECTOR')]
  },
  {
    path: 'cursos',
    component: CursosComponent,
    canActivate: [LoginGuard, rolGuard('ROOT', 'DOCENTE', 'DIRECTOR', 'PRECEPTOR', 'ADMINISTRATIVO')]
  },
  {
    path: 'administracion',
    component: AdministracionComponent,
    canActivate: [LoginGuard, rolGuard('ROOT')]
  },

  // Cualquier ruta desconocida redirige al login
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }