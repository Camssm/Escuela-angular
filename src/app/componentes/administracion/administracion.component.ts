import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  AdministracionService,
  Administracion
} from '../../servicios/administracion.service';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent implements OnInit {

  formulario!: FormGroup;

  administraciones: Administracion[] = [];

  constructor(
    private administracionService: AdministracionService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.obtenerAdministraciones();
  }

  initializeForm(): void {
    this.formulario = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      especialidad: ['', Validators.required]
    });
  }

  obtenerAdministraciones(): void {
    this.administracionService
      .getAdministraciones()
      .subscribe(resp => {
        this.administraciones = resp;
      });
  }

  guardarAdministracion(): void {

    if (this.formulario.invalid) return;

    const nuevaAdministracion: Administracion = this.formulario.value;

    this.administracionService
      .nuevaAdministracion(nuevaAdministracion)
      .subscribe(() => {

        this.formulario.reset();
        this.obtenerAdministraciones();

      });
  }
}