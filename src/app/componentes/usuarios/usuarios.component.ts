import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdministracionService, Personal, Cargo } from '../../servicios/administracion.service';
import { UsuarioService } from '../../servicios/usuario.service';
import { AuthService } from '../../servicios/auth.service';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  formulario!: FormGroup;
  personal: Personal[] = [];
  puedeCrear = false;
  creaCuenta = false;
  esDirector = false;
  idEdicion: number | null = null;
  mensaje = '';

  cargos: { valor: Cargo; texto: string }[] = [
    { valor: 'DOCENTE', texto: 'Docente' },
    { valor: 'DIRECTOR', texto: 'Director' },
    { valor: 'PRECEPTOR', texto: 'Preceptor' },
    { valor: 'ADMINISTRATIVO', texto: 'Administración' }
  ];

  constructor(
    private administracionService: AdministracionService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private sesion: AuthService
  ) { }

  ngOnInit(): void {
    this.puedeCrear = this.sesion.tieneRol('ROOT', 'ADMINISTRATIVO');
    this.creaCuenta = this.sesion.tieneRol('ROOT');
    this.esDirector = this.sesion.tieneRol('DIRECTOR');
    this.initializeForm();
    this.obtenerPersonal();
  }

  get titulo(): string {
    if (this.creaCuenta) return 'Gestión de usuarios';
    if (this.puedeCrear) return 'Gestión de personal';
    return 'Docentes';
  }

  initializeForm(): void {
    this.formulario = this.formBuilder.group({
      cargo: [null, Validators.required],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.creaCuenta ? [Validators.required, Validators.minLength(6)] : []]
    });
  }

  obtenerPersonal(): void {
    this.administracionService.getPersonal().subscribe({
      next: (resp) => {
        // El director solo ve a los docentes
        this.personal = this.esDirector ? resp.filter(p => p.cargo === 'DOCENTE') : resp;
      },
      error: (err) => this.mensaje = mensajeDeError(err)
    });
  }

  guardar(): void {
    if (this.formulario.invalid || !this.puedeCrear) return;

    const v = this.formulario.getRawValue();

    const persona: Personal = {
      nombre: v.nombre,
      apellido: v.apellido,
      dni: v.dni,
      email: v.email,
      cargo: v.cargo
    };

    // Modificar
    if (this.idEdicion !== null) {
      this.administracionService.editarPersonal({ ...persona, id: this.idEdicion }).subscribe({
        next: () => this.terminar('Datos actualizados'),
        error: (err) => this.mensaje = mensajeDeError(err)
      });
      return;
    }

    // Crear: primero el personal y después (solo Root) la cuenta de login
    this.administracionService.nuevoPersonal(persona).subscribe({
      next: () => {
        if (!this.creaCuenta) {
          this.terminar('Personal agregado');
          return;
        }

        this.usuarioService.crearCuenta({
          username: v.email,
          password: v.password,
          rol: v.cargo
        }).subscribe({
          next: () => this.terminar('Usuario creado. Ya puede iniciar sesión con su Gmail y contraseña'),
          error: (err) => {
            this.mensaje = 'Se guardó el personal pero falló la cuenta: ' + mensajeDeError(err);
            this.obtenerPersonal();
          }
        });
      },
      error: (err) => this.mensaje = mensajeDeError(err)
    });
  }

  editar(p: Personal): void {
    this.idEdicion = p.id ?? null;
    this.mensaje = '';
    this.formulario.patchValue({
      cargo: p.cargo,
      nombre: p.nombre,
      apellido: p.apellido,
      dni: p.dni,
      email: p.email
    });
    // El email es el usuario de login, no se cambia
    this.formulario.get('email')?.disable();
    this.formulario.get('password')?.disable();
  }

  cancelarEdicion(): void {
    this.idEdicion = null;
    this.mensaje = '';
    this.formulario.get('email')?.enable();
    this.formulario.get('password')?.enable();
    this.formulario.reset();
  }

  textoCargo(cargo: string): string {
    return this.cargos.find(c => c.valor === cargo)?.texto ?? cargo;
  }

  private terminar(texto: string): void {
    this.cancelarEdicion();
    this.mensaje = texto;
    this.obtenerPersonal();
  }
}