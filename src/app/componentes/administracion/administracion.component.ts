import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Inscripcion {
  alumno: string;
  curso: string;
}

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent {
  nuevaInscripcion: Inscripcion = { alumno: '', curso: '' };
  inscripciones: Inscripcion[] = [];

  guardarInscripcion() {
    if (this.nuevaInscripcion.alumno && this.nuevaInscripcion.curso) {
      this.inscripciones.push({ ...this.nuevaInscripcion });
      this.nuevaInscripcion = { alumno: '', curso: '' };
    }
  }
}