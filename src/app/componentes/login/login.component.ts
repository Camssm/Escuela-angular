import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../servicios/login.service';
import { AuthService, Rol } from '../../servicios/auth.service';

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
    private sesion: AuthService,
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

    localStorage.removeItem('demo');

    this.authService.login(this.formulario.value).subscribe({
      next: (resp) => {
        const token = resp.id_token || resp.token;
        if (token) {
          this.sesion.guardarSesion(token, resp.rol, resp.id);
          this.router.navigate([this.sesion.inicioPorRol()]);
        }
      },
      error: (err) => {
        console.error('Error de autenticación:', err);
        this.mensajeError = 'Usuario o contraseña incorrectos';
      }
    });
  }

  entrarDemo(rol: Rol): void {
    localStorage.setItem('demo', '1');
    this.sesion.guardarSesion('token-demo', rol);
    this.router.navigate([this.sesion.inicioPorRol()]);
  }
}