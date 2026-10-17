import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CursoService, Curso } from '../../servicios/curso.service';
import { AdministracionService, Personal } from '../../servicios/administracion.service';
import { AuthService } from '../../servicios/auth.service';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {

  formulario!: FormGroup;
  cursos: Curso[] = [];
  docentes: Personal[] = [];
  listaDocentes: boolean | null = null;
  puedeCrear = false;
  idEdicion: number | null = null;
  mensaje = '';

  constructor(
    private cursoService: CursoService,
    private administracionService: AdministracionService,
    private formBuilder: FormBuilder,
    private sesion: AuthService
  ) { }

  ngOnInit(): void {
    this.puedeCrear = this.sesion.puedeCrearCursos();
    this.initializeForm();
    this.obtenerCursos();

    if (this.puedeCrear) {
      this.obtenerDocentes();
    }
  }

  initializeForm(): void {
    this.formulario = this.formBuilder.group({
      materia: ['', [Validators.required, Validators.minLength(3)]],
      docenteId: [null, Validators.required],
      horario: ['', Validators.required],
      cupo: [null, [Validators.required, Validators.min(1)]]
    });
  }

  obtenerCursos(): void {
    this.cursoService.getCursos().subscribe({
      next: (resp) => this.cursos = resp,
      error: (err) => this.mensaje = mensajeDeError(err)
    });
  }

  obtenerDocentes(): void {
  this.administracionService.getPersonal().subscribe({
    next: (resp) => {
      this.docentes = resp.filter(p => p.cargo === 'DOCENTE');
      this.listaDocentes = true; // Si tiene permiso, se carga la lista
    },
    error: () => this.listaDocentes = false
  });
}

  guardarCurso(): void {
    if (this.formulario.invalid || !this.puedeCrear) return;

    const v = this.formulario.value;

    const curso: Curso = {
      materia: v.materia,
      docenteId: Number(v.docenteId),
      horario: v.horario,
      cupo: v.cupo
    };

    const peticion = this.idEdicion !== null
      ? this.cursoService.editarCurso({ ...curso, id: this.idEdicion })
      : this.cursoService.nuevoCurso(curso);

    peticion.subscribe({
      next: () => {
        this.cancelarEdicion();
        this.obtenerCursos();
      },
      error: (err) => this.mensaje = mensajeDeError(err)
    });
  }

  editar(curso: Curso): void {
    this.idEdicion = curso.id ?? null;
    this.mensaje = '';
    this.formulario.patchValue({
      materia: curso.materia,
      docenteId: curso.docenteId,
      horario: curso.horario,
      cupo: curso.cupo
    });
  }

  eliminar(curso: Curso): void {
    if (curso.id === undefined || !confirm('¿Eliminar este curso?')) return;

    this.cursoService.eliminarCurso(curso.id).subscribe({
      next: () => this.obtenerCursos(),
      error: (err) => this.mensaje = mensajeDeError(err)
    });
  }

  cancelarEdicion(): void {
    this.idEdicion = null;
    this.mensaje = '';
    this.formulario.reset();
  }
}