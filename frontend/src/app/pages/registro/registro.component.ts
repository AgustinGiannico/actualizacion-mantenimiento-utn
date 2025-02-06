import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailPattern, passwordPattern } from 'src/app/auth/validators/validators';
import { EnviarDatosService } from '../../auth/enviar-datos.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  formRegistro: FormGroup;
  message: string = '';
  messageType: 'error' | 'success' = 'error';

  constructor(
    private formBuilder: FormBuilder,
    private enviarDatosServicio: EnviarDatosService,
    private router: Router,
    private cookieService: CookieService, 
    private location: Location
  ) {
    this.formRegistro = this.formBuilder.group({
      username: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(40), Validators.pattern(emailPattern)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(passwordPattern)]],
      admin: [0, Validators.required]
    });
  }

  goBack(): void {
    this.location.back();
  }

  enviarDatos() {
    if (this.formRegistro.valid) {
      this.enviarDatosServicio.enviarFormularioRegistro(this.formRegistro.value).subscribe({
        next: (response) => {
          this.messageType = 'success';
          this.message = response.message || 'Usuario registrado exitosamente';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        error: (error) => {
          this.messageType = 'error';
          if (error.status === 400) {
            this.message = error.error?.error || 'El correo ya está registrado.';
          } else {
            this.message = 'Error al registrar el usuario. Por favor, intente más tarde.';
          }
          console.error('Error al registrar el usuario:', error);
        },
        complete: () => {
          console.info('Registro enviado con éxito.');
        },
      });
    } else {
      this.messageType = 'error';
      this.message = 'Complete todos los campos correctamente.';
      console.warn('Datos no enviados, verifique los requisitos o contacte al administrador.');
    }
  }
}
