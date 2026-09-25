import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CursoService, Curso } from '../../servicios/curso.service';

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

  constructor(
    private cursoService: CursoService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.obtenerCursos();
  }

  initializeForm(): void {
    this.formulario = this.formBuilder.group({
      materia: ['', [Validators.required, Validators.minLength(3)]],
      nombreMaestro: ['', [Validators.required, Validators.minLength(3)]],
      numSalon: [null, [Validators.required, Validators.min(1)]]
    });
  }

  obtenerCursos(): void {
    this.cursoService.getCursos().subscribe({
      next: (resp) => {
        this.cursos = resp;
      },
      error: (err) => console.error('Error al obtener cursos:', err)
    });
  }

  guardarCurso(): void {
    if (this.formulario.invalid) return;

    const nuevoCurso: Curso = this.formulario.value;

    this.cursoService.nuevoCurso(nuevoCurso).subscribe({
      next: () => {
        this.obtenerCursos(); // Vuelve a pedir la lista completa para reflejar los IDs generados por el backend
        this.formulario.reset();
      },
      error: (err) => console.error('Error al guardar curso:', err)
    });
  }
}