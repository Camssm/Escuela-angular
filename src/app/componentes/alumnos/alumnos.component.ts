import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // 1. Importar RouterLink
import { AlumnoService, Alumno } from '../../servicios/alumno.service';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // 2. Agregar RouterLink aquí
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {

  formulario!: FormGroup;
  alumnos: Alumno[] = [];

  constructor(
    private alumnoService: AlumnoService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.obtenerAlumnos();
  }

  initializeForm(): void {
    this.formulario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      gmail: ['', [Validators.required, Validators.email]]
    });
  }

  obtenerAlumnos(): void {
    this.alumnoService.getAlumnos().subscribe(resp => {
      this.alumnos = resp;
    });
  }

  guardarAlumno(): void {
    if (this.formulario.invalid) return;

    const nuevoAlumno: Alumno = this.formulario.value;

    this.alumnoService.nuevoAlumno(nuevoAlumno).subscribe(resp => {
        this.obtenerAlumnos(); 
      this.formulario.reset();
    });
  }
}