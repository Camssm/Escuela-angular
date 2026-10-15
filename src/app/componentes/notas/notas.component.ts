import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotaService, Nota } from '../../servicios/nota.service';
import { AlumnoService, Alumno } from '../../servicios/alumno.service';
import { CursoService, Curso } from '../../servicios/curso.service';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent implements OnInit {

  formulario!: FormGroup;
  notas: Nota[] = [];
  alumnos: Alumno[] = [];
  cursos: Curso[] = [];
  puedeEditar = false;
  esDocente = false;
  idEdicion: number | null = null;

  constructor(
    private notaService: NotaService,
    private alumnoService: AlumnoService,
    private cursoService: CursoService,
    private formBuilder: FormBuilder,
    private sesion: AuthService
  ) { }

  ngOnInit(): void {
    this.puedeEditar = this.sesion.puedeEditarNotas();
    this.esDocente = this.sesion.tieneRol('DOCENTE');
    this.initializeForm();

    this.alumnoService.getAlumnos().subscribe(resp => this.alumnos = resp);

    this.cursoService.getCursos().subscribe(resp => {
      // El docente solo trabaja con los cursos que tiene asignados
      this.cursos = this.esDocente
        ? resp.filter(c => c.docenteId === this.sesion.usuarioId)
        : resp;
      this.obtenerNotas();
    });
  }

  initializeForm(): void {
    this.formulario = this.formBuilder.group({
      alumnoId: ['', Validators.required],
      cursoId: ['', Validators.required],
      evaluacion: ['', Validators.required],
      nota: ['', [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  get alumnosHabilitados(): Alumno[] {
    return this.alumnos.filter(a => a.habilitado !== false);
  }

  obtenerNotas(): void {
    this.notaService.getNotas().subscribe({
      next: (resp) => {
        this.notas = this.esDocente
          ? resp.filter(n => this.cursos.some(c => c.id === n.cursoId))
          : resp;
      },
      error: (err) => console.error('Error al obtener notas:', err)
    });
  }

  guardarNota(): void {
    if (this.formulario.invalid || !this.puedeEditar) return;

    const datos: Nota = this.formulario.value;
    const peticion = this.idEdicion !== null
      ? this.notaService.modificarNota(this.idEdicion, datos)
      : this.notaService.nuevaNota(datos);

    peticion.subscribe(() => {
      this.cancelarEdicion();
      this.obtenerNotas();
    });
  }

  editar(nota: Nota): void {
    this.idEdicion = nota.id ?? null;
    this.formulario.patchValue({
      alumnoId: nota.alumnoId,
      cursoId: nota.cursoId,
      evaluacion: nota.evaluacion,
      nota: nota.nota
    });
  }

  eliminar(nota: Nota): void {
    if (nota.id === undefined || !confirm('¿Eliminar esta nota?')) return;
    this.notaService.eliminarNota(nota.id).subscribe(() => this.obtenerNotas());
  }

  cancelarEdicion(): void {
    this.idEdicion = null;
    this.formulario.reset();
  }

  nombreAlumno(id: number): string {
    const a = this.alumnos.find(x => x.id === id);
    return a ? `${a.apellido}, ${a.nombre}` : '—';
  }

  nombreCurso(id: number): string {
    return this.cursos.find(c => c.id === id)?.materia ?? '—';
  }
}