import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlumnoService, Alumno, EstadoAlumno } from '../../servicios/alumno.service';
import { CursoService, Curso } from '../../servicios/curso.service';
import { AuthService } from '../../servicios/auth.service';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {

  formulario!: FormGroup;
  alumnos: Alumno[] = [];
  cursos: Curso[] = [];
  puedeEditar = false;
  idEdicion: number | null = null;
  cursoOriginal: number | null = null;
  mensaje = '';
  detalleAlumno: any = null;
  cargandoDetalle = false;

  constructor(
    private alumnoService: AlumnoService,
    private cursoService: CursoService,
    private formBuilder: FormBuilder,
    private sesion: AuthService
  ) { }

  ngOnInit(): void {
    this.puedeEditar = this.sesion.puedeGestionarAlumnos();
    this.initializeForm();
    this.obtenerAlumnos();
    this.cursoService.getCursos().subscribe({
      next: (resp) => this.cursos = resp,
      error: (err) => this.mensaje = mensajeDeError(err)
    });
  }

  initializeForm(): void {
    this.formulario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      gmail: ['', [Validators.required, Validators.email]],
      cursoId: [null]
    });
  }

  obtenerAlumnos(): void {
    this.alumnoService.getAlumnos().subscribe({
      next: (resp) => this.alumnos = resp,
      error: (err) => this.mensaje = mensajeDeError(err)
    });
  }

  guardarAlumno(): void {
    if (this.formulario.invalid || !this.puedeEditar) return;

    const v = this.formulario.value;
    const cursoNuevo: number | null = v.cursoId ?? null;

    // Control de cupo (se valida acá en el front)
    if (cursoNuevo !== null && cursoNuevo !== this.cursoOriginal && this.cursoLleno(cursoNuevo)) {
      this.mensaje = 'Ese curso ya no tiene cupo disponible';
      return;
    }

    const datos: Alumno = {
      nombre: v.nombre,
      apellido: v.apellido,
      gmail: v.gmail,
      cursoId: cursoNuevo
    };

    const peticion = this.idEdicion !== null
      ? this.alumnoService.editarAlumno({ ...datos, id: this.idEdicion })
      : this.alumnoService.nuevoAlumno(datos);

    peticion.subscribe({
      next: () => {
        this.cancelarEdicion();
        this.obtenerAlumnos();
      },
      error: (err) => this.mensaje = mensajeDeError(err)
    });
  }

  editar(alumno: Alumno): void {
    this.idEdicion = alumno.id ?? null;
    this.cursoOriginal = alumno.cursoId ?? null;
    this.mensaje = '';
    this.formulario.patchValue({
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      gmail: alumno.gmail,
      cursoId: alumno.cursoId ?? null
    });
  }

  cancelarEdicion(): void {
    this.idEdicion = null;
    this.cursoOriginal = null;
    this.mensaje = '';
    this.formulario.reset({ cursoId: null });
  }

  cambiarEstado(alumno: Alumno): void {
    if (alumno.id === undefined) return;

    let nuevo: EstadoAlumno;
    if (alumno.estado === 'DESHABILITADO') {
      nuevo = alumno.cursoId ? 'ASIGNADO' : 'SINASIGNACION';
    } else {
      nuevo = 'DESHABILITADO';
    }

    this.alumnoService.cambiarEstado(alumno.id, nuevo).subscribe({
      next: () => this.obtenerAlumnos(),
      error: (err) => this.mensaje = mensajeDeError(err)
    });
  }

  ocupados(cursoId?: number): number {
    return this.alumnos.filter(a => a.cursoId === cursoId && a.estado === 'ASIGNADO').length;
  }

  cursoLleno(cursoId: number): boolean {
    const curso = this.cursos.find(c => c.id === cursoId);
    return !!curso && this.ocupados(cursoId) >= curso.cupo;
  }

  nombreCurso(cursoId?: number | null): string {
    if (!cursoId) return '—';
    return this.cursos.find(c => c.id === cursoId)?.materia ?? '—';
  }

  textoEstado(alumno: Alumno): string {
    switch (alumno.estado) {
      case 'ASIGNADO': return 'Asignado';
      case 'SINASIGNACION': return 'Sin asignar';
      case 'DESHABILITADO': return 'Deshabilitado';
      default: return '—';
    }
  }

  claseEstado(alumno: Alumno): string {
    switch (alumno.estado) {
      case 'ASIGNADO': return 'badge-ok';
      case 'SINASIGNACION': return 'badge-warn';
      default: return 'badge-off';
    }
  }

verDetalle(alumno: Alumno): void {
  if (alumno.id === undefined) return;

  this.detalleAlumno = null;
  this.cargandoDetalle = true;

  this.alumnoService.obtenerConCurso(alumno.id).subscribe({
    next: (resp) => {
      this.detalleAlumno = resp;
      this.cargandoDetalle = false;
    },
    error: (err) => {
      this.cargandoDetalle = false;
      this.mensaje = mensajeDeError(err);
    }
  });
}

cerrarDetalle(): void {
  this.detalleAlumno = null;
}

}