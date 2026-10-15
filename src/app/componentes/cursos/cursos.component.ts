import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CursoService, Curso } from '../../servicios/curso.service';
import { UsuarioService, Usuario } from '../../servicios/usuario.service';
import { AuthService } from '../../servicios/auth.service';

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
  docentes: Usuario[] = [];
  puedeCrear = false;
  esDocente = false;
  idEdicion: number | null = null;

  constructor(
    private cursoService: CursoService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private sesion: AuthService
  ) { }

  ngOnInit(): void {
    this.puedeCrear = this.sesion.puedeCrearCursos();
    this.esDocente = this.sesion.tieneRol('DOCENTE');
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
      next: (resp) => {
        // El docente solo ve los cursos que tiene asignados
        this.cursos = this.esDocente
          ? resp.filter(c => c.docenteId === this.sesion.usuarioId)
          : resp;
      },
      error: (err) => console.error('Error al obtener cursos:', err)
    });
  }

  obtenerDocentes(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (resp) => {
        this.docentes = resp.filter(u => u.rol === 'DOCENTE' && u.habilitado !== false);
      },
      error: (err) => console.error('Error al obtener docentes:', err)
    });
  }

  guardarCurso(): void {
    if (this.formulario.invalid || !this.puedeCrear) return;

    const valores = this.formulario.value;
    const docente = this.docentes.find(d => d.id === valores.docenteId);

    const curso: Curso = {
      materia: valores.materia,
      docenteId: valores.docenteId,
      nombreMaestro: docente ? `${docente.nombre} ${docente.apellido}` : '',
      horario: valores.horario,
      cupo: valores.cupo
    };

    const peticion = this.idEdicion !== null
      ? this.cursoService.editarCurso({ ...curso, id: this.idEdicion })
      : this.cursoService.nuevoCurso(curso);

    peticion.subscribe(() => {
      this.cancelarEdicion();
      this.obtenerCursos();
    });
  }

  editar(curso: Curso): void {
    this.idEdicion = curso.id ?? null;
    this.formulario.patchValue({
      materia: curso.materia,
      docenteId: curso.docenteId,
      horario: curso.horario,
      cupo: curso.cupo
    });
  }

  eliminar(curso: Curso): void {
    if (curso.id === undefined || !confirm('¿Eliminar este curso?')) return;
    this.cursoService.eliminarCurso(curso.id).subscribe(() => this.obtenerCursos());
  }

  cancelarEdicion(): void {
    this.idEdicion = null;
    this.formulario.reset();
  }
}