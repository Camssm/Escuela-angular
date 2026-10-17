import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NotaService, Nota } from '../../servicios/nota.service';
import {
  EvaluacionService,
  Evaluacion,
  TipoEvaluacion
} from '../../servicios/evaluacion.service';
import { AlumnoService, Alumno } from '../../servicios/alumno.service';
import { CursoService, Curso } from '../../servicios/curso.service';
import { AuthService } from '../../servicios/auth.service';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent implements OnInit {

  formulario!: FormGroup;

  cursos: Curso[] = [];
  evaluaciones: Evaluacion[] = [];
  alumnos: Alumno[] = [];
  notas: Nota[] = [];

  cursoId: number | null = null;
  evaluacionId: number | null = null;

  puedeEditar = false;
  esDocente = false;
  mensaje = '';

  tipos: { valor: TipoEvaluacion; texto: string }[] = [
    { valor: 'EXAMEN', texto: 'Examen' },
    { valor: 'EXAMEN_ORAL', texto: 'Examen oral' },
    { valor: 'EXAMEN_PRACTICO', texto: 'Examen práctico' },
    { valor: 'TP_PRACTICO', texto: 'TP práctico' },
    { valor: 'RECUPERATORIO', texto: 'Recuperatorio' },
    { valor: 'TRABAJO_GRUPAL', texto: 'Trabajo grupal' }
  ];

  constructor(
    private notaService: NotaService,
    private evaluacionService: EvaluacionService,
    private alumnoService: AlumnoService,
    private cursoService: CursoService,
    private formBuilder: FormBuilder,
    private sesion: AuthService
  ) {}

  ngOnInit(): void {
    this.puedeEditar = this.sesion.puedeEditarNotas();
    this.esDocente = this.sesion.tieneRol('DOCENTE');

    this.formulario = this.formBuilder.group({
      tipo: [null, Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', Validators.required]
    });

    this.cargarCursos();
  }

  private cargarCursos(): void {
    this.cursoService.getCursos().subscribe({
      next: (resp) => {
        this.cursos = resp;
        console.log('Cursos recibidos:', resp);
      },
      error: (err) => {
        this.mensaje = mensajeDeError(err);
      }
    });
  }

  seleccionarCurso(id: number | null): void {
    this.cursoId = id;
    this.evaluacionId = null;
    this.evaluaciones = [];
    this.alumnos = [];
    this.notas = [];
    this.mensaje = '';

    if (id === null) return;

    this.evaluacionService.getPorCurso(id).subscribe({
      next: (resp) => this.evaluaciones = resp,
      error: (err) => this.mensaje = mensajeDeError(err)
    });

     this.alumnoService.getAlumnosPorCurso(id).subscribe({
  next: (resp) => {
    this.alumnos = resp;
    console.log('Alumnos del curso:', resp);
  },
  error: (err) => this.mensaje = mensajeDeError(err)
});
  }

  seleccionarEvaluacion(id: number | null): void {
    this.evaluacionId = id;
    this.notas = [];
    this.mensaje = '';
    this.cargarNotas();
  }

  cargarNotas(): void {
  if (this.evaluacionId === null) return;

  this.notaService.getPorEvaluacion(this.evaluacionId).subscribe({
    next: (resp) => {
      console.log('Notas recibidas del backend:', resp);
      this.notas = resp;
    },
    error: (err) => {
      console.error('Error al cargar las notas:', err);
      this.mensaje = mensajeDeError(err);
    }
  });
}

  crearEvaluacion(): void {
    if (
      this.formulario.invalid ||
      this.cursoId === null ||
      !this.puedeEditar
    ) {
      return;
    }

    const nueva: Evaluacion = {
      ...this.formulario.value,
      cursoId: this.cursoId
    };

    this.evaluacionService.crear(nueva).subscribe({
      next: (creada) => {
        this.formulario.reset();
        this.evaluaciones = [...this.evaluaciones, creada];
        this.seleccionarEvaluacion(creada.id ?? null);
      },
      error: (err) => this.mensaje = mensajeDeError(err)
    });
  }

  notaDe(alumnoId?: number): Nota | undefined {
    return this.notas.find(n => n.alumnoId === alumnoId);
  }

  guardarNota(alumno: Alumno, texto: string): void {
    if (
      !this.puedeEditar ||
      this.evaluacionId === null ||
      alumno.id === undefined
    ) {
      return;
    }

    const valor = Number(texto);

    if (
      texto.trim() === '' ||
      isNaN(valor) ||
      valor < 0 ||
      valor > 10
    ) {
      this.mensaje = 'La nota debe estar entre 0 y 10';
      return;
    }

    const existente = this.notaDe(alumno.id);

    const peticion = existente?.id !== undefined
      ? this.notaService.editar(existente.id, valor)
      : this.notaService.crear({
          valor,
          evaluacionId: this.evaluacionId,
          alumnoId: alumno.id
        });

    peticion.subscribe({
      next: () => {
        this.mensaje = '';
        this.cargarNotas();
      },
      error: (err) => this.mensaje = mensajeDeError(err)
    });
  }

  eliminarNota(alumno: Alumno): void {
    const existente = this.notaDe(alumno.id);

    if (
      !this.puedeEditar ||
      existente?.id === undefined ||
      !confirm('¿Eliminar esta nota?')
    ) {
      return;
    }

    this.notaService.eliminar(existente.id).subscribe({
      next: () => this.cargarNotas(),
      error: (err) => this.mensaje = mensajeDeError(err)
    });
  }

  textoEvaluacion(e: Evaluacion): string {
    const tipo = this.tipos.find(t => t.valor === e.tipo)?.texto ?? e.tipo;
    return `${tipo} - ${e.descripcion} (${e.fecha})`;
  }
}
