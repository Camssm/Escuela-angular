import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Importamos Router para navegar después del login
import { LoginService } from '../../servicios/login.service'; // Ajusta la ruta a tu auth.service

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formulario!: FormGroup;
  mensajeError: string = '';

  constructor(
    private authService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.formulario = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onLogin(): void {
    if (this.formulario.invalid) return;

    this.authService.login(this.formulario.value).subscribe({
      next: (resp) => {
        // Guardamos el token que responde el backend
        const token = resp.id_token || resp.token;
        if (token) {
          localStorage.setItem('token', token);
          this.router.navigate(['/administracion']); 
        }
      },
      error: (err) => {
        console.error('Error de autenticación:', err);
        this.mensajeError = 'Usuario o contraseña incorrectos';
      }
    });
  }
}