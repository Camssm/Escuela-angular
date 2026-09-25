import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdministracionService, Administracion } from '../../servicios/administracion.service';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent implements OnInit {

  formulario!: FormGroup;
  administracion: Administracion[] = []; // 👈 Corregido typo en la variable

  constructor(
    private administracionService: AdministracionService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.obtenerAdministracion();
  }

  initializeForm(): void {
    this.formulario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      especialidad: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  obtenerAdministracion(): void {
    this.administracionService.getAdministracion().subscribe({
      next: (resp) => {
        this.administracion = resp;
      },
      error: (err) => console.error('Error al obtener registros:', err)
    });
  }

  guardarAdministracion(): void {
    if (this.formulario.invalid) return;

    const nuevaAdministracion: Administracion = this.formulario.value; 

    this.administracionService.nuevaAdministracion(nuevaAdministracion).subscribe({
      next: () => {
        this.obtenerAdministracion(); 
        this.formulario.reset();}
       });
  }
}