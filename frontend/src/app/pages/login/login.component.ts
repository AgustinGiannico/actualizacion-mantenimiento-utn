import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnviarDatosService } from '../../auth/enviar-datos.service';
import { emailPattern, passwordPattern } from 'src/app/auth/validators/validators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  providers: [EnviarDatosService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formLogin: FormGroup;
  mensaje: string = '';
  tipoMensaje: 'error' | 'exito' = 'error';

  constructor(
    private formbuilder: FormBuilder,
    private enviarDatosServicio: EnviarDatosService,
    private router: Router,
    private cookieService: CookieService
  ) {

    this.formLogin = this.formbuilder.group({
      email: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(40), Validators.pattern(emailPattern)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(passwordPattern)]],
    });
  }

  enviarDatos() {
    if (this.formLogin.valid) {
      this.enviarDatosServicio.enviarFormularioLogin(this.formLogin.value).subscribe({
        next: (response) => {
          if (response.token) {
            const expireDate = new Date();
            expireDate.setHours(expireDate.getHours() + 1);
            this.cookieService.set('jwt', response.token, { expires: expireDate, secure: false, sameSite: 'Lax' });
          }

          this.tipoMensaje = 'exito';
          this.mensaje = 'Inicio de sesión exitoso';

          if (response.isAdmin) {
            this.mensaje += ' (Bienvenido administrador)';
          }

          this.router.navigate(['/']);
        },
        error: (error) => {
          this.tipoMensaje = 'error';

          if (error.status === 401) {
            if (error.error?.error === 'Usuario no encontrado') {
              this.mensaje = 'El usuario no existe. Verifique sus credenciales.';
            } else if (error.error?.error === 'Contraseña incorrecta') {
              this.mensaje = 'La contraseña es incorrecta. Intente de nuevo.';
            }
          } else {
            this.mensaje = 'Error en el servidor. Por favor, intente más tarde.';
          }
        },
        complete: () => {
          console.info('Enviado con éxito.');
        },
      });
    } else {
      console.warn('Datos no enviados, verifique los requisitos o contacte al administrador.');
      this.tipoMensaje = 'error';
      this.mensaje = 'Formulario inválido. Verifique los campos e intente de nuevo.';
    }
  }
}
