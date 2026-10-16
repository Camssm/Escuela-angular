import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnosComponent } from './componentes/alumnos/alumnos.component';
import { CursosComponent } from './componentes/cursos/cursos.component';
import { LoginComponent } from './componentes/login/login.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { NotasComponent } from './componentes/notas/notas.component';
import { LoginGuard } from './guards/login.guard';
import { rolGuard } from './guards/rol.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [LoginGuard, rolGuard('ROOT', 'ADMINISTRATIVO', 'DIRECTOR')]
  },
  {
    path: 'alumnos',
    component: AlumnosComponent,
    canActivate: [LoginGuard, rolGuard('PRECEPTOR', 'ADMINISTRATIVO', 'DIRECTOR')]
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

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }