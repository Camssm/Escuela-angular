import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService, Usuario, RolUsuario } from '../../servicios/usuario.service';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  formulario!: FormGroup;
  usuarios: Usuario[] = [];
  esRoot = false;

  roles: { valor: RolUsuario; texto: string }[] = [
    { valor: 'DOCENTE', texto: 'Docente' },
    { valor: 'DIRECTOR', texto: 'Director' },
    { valor: 'PRECEPTOR', texto: 'Preceptor' },
    { valor: 'ADMINISTRATIVO', texto: 'Administración' }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private sesion: AuthService
  ) { }

  ngOnInit(): void {
    this.esRoot = this.sesion.tieneRol('ROOT');
    this.initializeForm();
    this.obtenerUsuarios();
  }

  initializeForm(): void {
    this.formulario = this.formBuilder.group({
      rol: [null, Validators.required],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  obtenerUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (resp) => {
        // El director solo ve docentes
        this.usuarios = this.esRoot ? resp : resp.filter(u => u.rol === 'DOCENTE');
      },
      error: (err) => console.error('Error al obtener usuarios:', err)
    });
  }

  guardarUsuario(): void {
    if (this.formulario.invalid || !this.esRoot) return;

    const nuevoUsuario: Usuario = this.formulario.value;

    this.usuarioService.nuevoUsuario(nuevoUsuario).subscribe(() => {
      this.formulario.reset();
      this.obtenerUsuarios();
    });
  }

  textoRol(rol: string): string {
    return this.roles.find(r => r.valor === rol)?.texto ?? rol;
  }

    cambiarEstado(usuario: Usuario): void {
    if (usuario.id === undefined || !this.esRoot) return;

    const estabaHabilitado = usuario.habilitado !== false;

    this.usuarioService.cambiarEstado(usuario.id, !estabaHabilitado).subscribe(() => {
      usuario.habilitado = !estabaHabilitado;
    });
  }
}