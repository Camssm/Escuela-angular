import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Curso {
  id?: number;
  nombre: string;
  duracion: string;
}

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent {
  nuevoCurso: Curso = { nombre: '', duracion: '' };
  cursos: Curso[] = [];

  guardarCurso() {
    if (this.nuevoCurso.nombre && this.nuevoCurso.duracion) {
      this.cursos.push({ ...this.nuevoCurso, id: Date.now() });
      this.nuevoCurso = { nombre: '', duracion: '' };
    }
  }
}